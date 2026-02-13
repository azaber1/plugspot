# 🚀 Deploy Backend to Railway (5 Minutes)

Your frontend is on Vercel ✅, but you need to deploy the **backend server** separately.

## Step-by-Step Guide

### Step 1: Go to Railway
1. Visit: https://railway.app
2. Sign up/login (use GitHub to connect)

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `azaber1/plugspot`

### Step 3: Configure Backend
1. After deployment starts, click on the project
2. Click **"Settings"** tab
3. Find **"Root Directory"** setting
4. Change it to: `server`
5. Click **"Save"**

### Step 4: Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"New Variable"**
3. Add these one by one:

```
RESEND_API_KEY = re_4DuR1L5i_CQx6ExMNDQ23QXvAiymJkzFR
PORT = 3001
```

4. For Stripe (add these when you have them):
```
STRIPE_SECRET_KEY = sk_live_YOUR_SECRET_KEY
STRIPE_CONNECT_CLIENT_ID = ca_YOUR_CLIENT_ID
```

### Step 5: Get Your Backend URL
1. Go to **"Settings"** tab
2. Find **"Domains"** section
3. Railway will give you a URL like: `https://your-app.railway.app`
4. Copy this URL!

### Step 6: Update Frontend (Vercel)
1. Go back to Vercel dashboard
2. Go to your project → **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. Click the **three dots** → **Edit**
5. Change value to: `https://your-app.railway.app/api`
   (Replace `your-app` with your actual Railway app name)
6. Click **Save**

### Step 7: Redeploy Frontend
1. In Vercel, go to **Deployments**
2. Click the **three dots** on latest deployment
3. Click **"Redeploy"**
4. Wait for it to finish

## ✅ Done!

Now your frontend (Vercel) will talk to your backend (Railway)!

---

## Alternative: Deploy to Render

If Railway doesn't work, use Render:

1. Go to: https://render.com
2. **New** → **Web Service**
3. Connect GitHub → Select `azaber1/plugspot`
4. Settings:
   - **Name:** `plugspot-backend`
   - **Root Directory:** `server`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
5. Add environment variables (same as above)
6. Deploy!
7. Get URL from Render dashboard
8. Update `VITE_API_URL` in Vercel to: `https://your-app.onrender.com/api`

---

## Test It Works

After deploying, test your backend:
```bash
curl https://your-backend-url.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If it works, your backend is live! 🎉
