# Deployment Guide

## Local Development

See [README.md](README.md) for local setup instructions.

## Production Deployment

### Option 1: Deploy Frontend and Backend Separately

#### Frontend (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Backend (Heroku/Railway/Render)

1. **Create `Procfile` for Heroku:**
   ```
   web: cd backend && python app.py
   ```

2. **Create `runtime.txt` for Python version:**
   ```
   python-3.10.0
   ```

3. **Deploy:**
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `cd backend && python app.py`

### Option 2: Full Stack Deployment (Render/Railway)

1. **Create `render.yaml`:**
   ```yaml
   services:
     - type: web
       name: backend
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: cd backend && python app.py
       envVars:
         - key: FLASK_ENV
           value: production
   
     - type: web
       name: frontend
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm run preview
       staticPublishPath: ./dist
   ```

### Environment Variables

Create a `.env` file (or set in your hosting platform):

```env
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5000
```

### CORS Configuration

Update `backend/app.py` CORS settings for production:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-frontend-domain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

## Docker Deployment (Optional)

### Create `Dockerfile` (Backend)

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY uploads/ ./uploads/

EXPOSE 5000

CMD ["python", "backend/app.py"]
```

### Create `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./uploads:/app/uploads
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## Notes

- Make sure to create the `uploads` directory on your server
- Set proper file permissions for uploads
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set up proper error logging
