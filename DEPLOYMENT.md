# Deployment Guide - Graphics Feature

## Frontend Deployment

### Environment Configuration

Before deploying to production, configure the backend API URL:

1. **Open `frontend/.env.production`**
2. **Set the correct API URL** (choose one):

```env
# Option 1: Same domain as frontend
REACT_APP_API_URL=https://digivents.com.np

# Option 2: Separate API domain
REACT_APP_API_URL=https://api.digivents.com.np

# Option 3: Relative path (if behind reverse proxy)
REACT_APP_API_URL=/
```

### Build & Deploy

```bash
cd frontend
npm run build
# Deploy the /build folder to your hosting
```

**Important:** The `.env` file should NOT be committed to GitHub. Use `.env.example` as a template.

---

## Backend Deployment

### Environment Configuration

Create a `.env` file in the backend root with your production settings:

```env
HOST=0.0.0.0
PORT=1337

# Database (adjust to your production database)
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-password

# Security tokens (generate unique values)
APP_KEYS=[your-secure-key-1,your-secure-key-2]
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
```

### CORS Configuration

The CORS is already configured in `backend/config/middlewares.js` to allow:
- `https://digivents.com.np`
- `http://localhost:3000`

If your frontend domain is different, update it in the middlewares config:

```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://your-domain.com', 'http://localhost:3000'],
    // ... rest of config
  },
}
```

### Deploy

```bash
cd backend
npm install
npm run build
npm start
```

---

## Troubleshooting

### Graphics not showing on frontend

1. **Check API URL:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for `[API Config] Using API URL: ...`
   - Ensure it shows your correct backend URL

2. **Check Network requests:**
   - Go to Network tab
   - Refresh page
   - Look for `/api/graphics` request
   - Check status code (200 = success, 5xx = backend error)

3. **Verify backend:**
   - Visit `https://your-backend-url/api/graphics?populate=*`
   - Should return JSON array with graphics

4. **Check if graphics are published:**
   - Open Strapi Admin
   - Go to Graphics section
   - Ensure status shows "Published" (not "Draft")

### CORS errors

If you see `CORS error` in console:
1. Check `backend/config/middlewares.js`
2. Verify your frontend domain is in the `origin` array
3. Restart the backend server

---

## Quick Checklist

- [ ] Graphics are published in Strapi Admin
- [ ] `.env.production` has correct `REACT_APP_API_URL`
- [ ] Backend `.env` has correct database and API settings
- [ ] Frontend build test: `npm run build` completes without errors
- [ ] CORS configured for frontend domain
- [ ] Test API endpoint directly in browser
- [ ] Push code to GitHub
- [ ] Deploy both frontend and backend
