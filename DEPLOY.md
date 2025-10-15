# 🚀 Deployment Guide

## Quick Deploy (5 minutes)

### 1. Deploy Backend to Railway
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository and choose the `backend` folder
4. Railway will auto-detect Node.js and deploy
5. In Railway dashboard:
   - Go to Variables tab
   - Add: `PUBLIC_BASE_URL=https://your-backend-url.railway.app`
   - Note your backend URL (e.g., `https://qr-backend-production.railway.app`)

### 2. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" → Import your repository
3. Set Root Directory to `frontend`
4. Add Environment Variable:
   - `VITE_BACKEND_URL=https://your-backend-url.railway.app`
5. Deploy!

### 3. Update Backend URL
After Railway deployment, update the backend's `PUBLIC_BASE_URL` environment variable to use the Railway URL.

## URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`
- QR Codes will point to: `https://your-backend.railway.app/r/SHORTCODE`

## Features in Production
✅ Create QR codes from any device  
✅ Scan QR codes from any device  
✅ Update destinations instantly  
✅ Analytics tracking  
✅ No local network configuration needed  

## Test It
1. Open your Vercel URL
2. Create a QR code
3. Scan it from your phone (works from anywhere!)
4. Edit the destination and scan again - should redirect to the new URL immediately