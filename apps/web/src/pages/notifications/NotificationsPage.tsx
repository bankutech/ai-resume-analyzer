import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Terminal,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
  Inbox,
} from 'lucide-react';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'SYSTEM';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType | string;
  actionUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'INFO' | 'SUCCESS' | 'WARNING' | 'SYSTEM'>('ALL');

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading,
  } = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await api.get<{ status?: string; notifications?: NotificationItem[] } | NotificationItem[]>('/notifications');
        if ('notifications' in res && Array.isArray(res.notifications)) {
          return res.notifications;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      } catch (err: unknown) {
        console.error('[Fetch Notifications Error]', err);
        return [];
      }
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return api.patch<{ status: string; count?: number }>('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(['notifications'], (old = []) =>
        old.map((n) => ({ ...n, isRead: true }))
      );
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All Notifications Marked Read', 'Your inbox is now clean and synchronized.');
    },
    onError: (err: Error) => {
      toast.error('Failed to Mark Read', err.message || 'Error updating notifications in Neon.');
    },
  });

  // Mark single notification as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch<{ status: string }>(`/notifications/${id}/read`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<NotificationItem[]>(['notifications']);

      queryClient.setQueryData<NotificationItem[]>(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete<{ status: string }>(`/notifications/${id}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<NotificationItem[]>(['notifications']);

      queryClient.setQueryData<NotificationItem[]>(['notifications'], (old = []) =>
        old.filter((n) => n.id !== id)
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Notification Removed', 'Notification was deleted from inbox.');
    },
    onError: (err: Error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }
      toast.error('Failed to Delete', err.message || 'Notification deletion failed.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    if (notification.actionUrl) {
      if (notification.actionUrl.startsWith('http://') || notification.actionUrl.startsWith('https://')) {
        window.open(notification.actionUrl, '_blank', 'noreferrer');
      } else {
        navigate(notification.actionUrl);
      }
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleToggleRead = (notification: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
      toast.info('Marked Read', 'Notification marked as viewed.');
    }
  };

  // Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'UNREAD') return !item.isRead;
    if (activeFilter === 'INFO') return item.type === 'INFO';
    if (activeFilter === 'SUCCESS') return item.type === 'SUCCESS';
    if (activeFilter === 'WARNING') return item.type === 'WARNING';
    if (activeFilter === 'SYSTEM') return item.type === 'SYSTEM';
    return true;
  });

  // Time format helper
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return past.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  // Style configurations by notification type
  const getTypeConfig = (type: string) => {
    const upper = (type || 'INFO').toUpperCase();
    switch (upper) {
      case 'SUCCESS':
        return {
          borderClass: 'border-l-4 border-l-forest-500 hover:border-forest-600',
          badgeClass: 'bg-forest-50 text-forest-700 border border-forest-200',
          icon: <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />,
          label: 'Success',
        };
      case 'WARNING':
        return {
          borderClass: 'border-l-4 border-l-ochre-500 hover:border-ochre-600',
          badgeClass: 'bg-ochre-50 text-ochre-700 border border-ochre-200',
          icon: <AlertTriangle className="w-4 h-4 text-ochre-500 shrink-0 mt-0.5" />,
          label: 'Alert',
        };
      case 'SYSTEM':
        return {
          borderClass: 'border-l-4 border-l-slate-400 hover:border-slate-500',
          badgeClass: 'bg-archival-100 text-slate-400 border border-archival-200',
          icon: <Terminal className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />,
          label: 'System',
        };
      case 'INFO':
      default:
        return {
          borderClass: 'border-l-4 border-l-royal-500 hover:border-royal-600',
          badgeClass: 'bg-royal-50 text-royal-700 border border-royal-200',
          icon: <Info className="w-4 h-4 text-royal-600 shrink-0 mt-0.5" />,
          label: 'Info',
        };
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-archival-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700 shadow-paper-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight">
                  Notification Center
                </h1>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-forest-50 text-forest-700 border border-forest-200 animate-pulse">
                    {unreadCount} unread
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-archival-100 border border-archival-200">
                    All caught up
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Real-time career telemetry, ATS audit reports, and job pipeline transitions.
              </p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => markAllReadMutation.mutate()}
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-forest-50 text-forest-700 border border-forest-200 shadow-paper-xs text-xs font-mono transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-4 h-4 text-forest-700" />
            <span>{markAllReadMutation.isPending ? 'Marking...' : 'Mark All Read'}</span>
          </button>
        </div>
      </div>

      {/* 2. Control & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              activeFilter === 'ALL'
                ? 'bg-royal-600 text-white font-semibold shadow-paper-xs'
                : 'bg-white text-slate-400 hover:text-slate-100 hover:bg-archival-50 border border-archival-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              activeFilter === 'UNREAD'
                ? 'bg-forest-600 text-white font-semibold shadow-paper-xs'
                : 'bg-white text-slate-400 hover:text-slate-100 hover:bg-archival-50 border border-archival-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('SUCCESS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              activeFilter === 'SUCCESS'
                ? 'bg-forest-600 text-white font-semibold shadow-paper-xs'
                : 'bg-white text-slate-400 hover:text-slate-100 hover:bg-archival-50 border border-archival-200'
            }`}
          >
            Success
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('WARNING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              activeFilter === 'WARNING'
                ? 'bg-ochre-500 text-white font-semibold shadow-paper-xs'
                : 'bg-white text-slate-400 hover:text-slate-100 hover:bg-archival-50 border border-archival-200'
            }`}
          >
            Alerts
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('INFO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              activeFilter === 'INFO'
                ? 'bg-royal-600 text-white font-semibold shadow-paper-xs'
                : 'bg-white text-slate-400 hover:text-slate-100 hover:bg-archival-50 border border-archival-200'
            }`}
          >
            Info
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('SYSTEM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
              activeFilter === 'SYSTEM'
                ? 'bg-slate-950 text-white font-semibold shadow-paper-xs'
                : 'bg-white text-slate-400 hover:text-slate-100 hover:bg-archival-50 border border-archival-200'
            }`}
          >
            System
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredNotifications.length} of {notifications.length}
        </span>
      </div>

      {/* 3. Notification List or Skeletons */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-archival-200 animate-pulse flex items-start justify-between gap-4 shadow-paper-xs"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="w-5 h-5 rounded-full bg-archival-100 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-archival-100 rounded w-1/3" />
                  <div className="h-3 bg-archival-100/80 rounded w-2/3" />
                </div>
              </div>
              <div className="h-3 bg-archival-100 rounded w-16" />
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* 4. Empty State */
        <div className="p-16 rounded-2xl bg-white border border-dashed border-archival-200 text-center space-y-4 shadow-paper-xs">
          <div className="w-12 h-12 rounded-2xl bg-archival-50 border border-archival-200 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              {activeFilter === 'UNREAD' ? 'No unread notifications' : 'All caught up!'}
            </h3>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto mt-1">
              {activeFilter === 'UNREAD'
                ? 'You have viewed all updates. Check other filters to inspect past activity.'
                : 'New notifications regarding job application follow-ups, ATS rubric diagnostics, and system events will appear here.'}
            </p>
          </div>
          {activeFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className="px-3.5 py-1.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white text-xs font-mono transition shadow-paper-xs"
            >
              View All Notifications
            </button>
          )}
        </div>
      ) : (
        /* 5. Notification Items List */
        <div className="space-y-2.5">
          {filteredNotifications.map((notification) => {
            const config = getTypeConfig(notification.type);

            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`group relative p-4 rounded-2xl border bg-white shadow-paper-xs hover:shadow-paper-sm transition-all cursor-pointer ${
                  config.borderClass
                } ${notification.isRead ? 'border-archival-200 opacity-90' : 'border-archival-300 ring-1 ring-royal-500/10'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon, Details */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {config.icon}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs transition ${
                            notification.isRead ? 'font-medium text-slate-300' : 'font-bold text-slate-100'
                          }`}
                        >
                          {notification.title}
                        </span>

                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${config.badgeClass}`}>
                          {config.label}
                        </span>

                        {!notification.isRead && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-forest-700 bg-forest-50 px-1.5 py-0.2 rounded border border-forest-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-ping" />
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-sans text-slate-400 mt-1 leading-relaxed break-words">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTimeAgo(notification.createdAt)}
                        </span>

                        {notification.actionUrl && (
                          <span className="flex items-center gap-1 text-royal-600 group-hover:underline">
                            <ExternalLink className="w-3 h-3" />
                            <span>Action Available</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(notification, e)}
                        className="p-1.5 text-slate-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
