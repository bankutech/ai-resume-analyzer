const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private accessToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.accessToken = localStorage.getItem('rf_access_token');
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('rf_access_token', token);
    } else {
      localStorage.removeItem('rf_access_token');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers = {}, ...customConfig } = options;

    let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
      credentials: 'include', // Ensures cookies are sent and received
    };

    let response = await fetch(url, config);

    // If 401 Unauthorized, attempt refresh token rotation once
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data.accessToken) {
              this.setAccessToken(data.accessToken);
              this.onTokenRefreshed(data.accessToken);
              this.isRefreshing = false;

              // Retry original request with new access token
              const retryHeaders = {
                ...defaultHeaders,
                ...(headers as Record<string, string>),
                Authorization: `Bearer ${data.accessToken}`,
              };
              response = await fetch(url, { ...config, headers: retryHeaders });
            } else {
              this.setAccessToken(null);
              this.isRefreshing = false;
            }
          } else {
            this.setAccessToken(null);
            this.isRefreshing = false;
          }
        } catch (refreshErr) {
          this.setAccessToken(null);
          this.isRefreshing = false;
        }
      } else {
        // Wait for active refresh to finish
        const retryToken = await new Promise<string>((resolve) => {
          this.addRefreshSubscriber(resolve);
        });
        const retryHeaders = {
          ...defaultHeaders,
          ...(headers as Record<string, string>),
          Authorization: `Bearer ${retryToken}`,
        };
        response = await fetch(url, { ...config, headers: retryHeaders });
      }
    }

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // use default error message
      }
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      throw error;
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
