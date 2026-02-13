# 🚀 Quick Start Guide

## ✅ What's Already Set Up

1. **Resend API Key** - ✅ Added to `server/.env`
2. **Backend Server** - ✅ Ready to deploy
3. **Email Notifications** - ✅ Configured
4. **Photo Uploads** - ✅ Ready
5. **Stripe Payments** - ✅ Backend ready

## 🎯 Next Steps (15 minutes)

### Step 1: Add Stripe Keys (5 min)

Edit `server/.env` and add your Stripe keys:

```env
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY
STRIPE_CONNECT_CLIENT_ID=ca_YOUR_CLIENT_ID
```

**Where to find them:**
- Secret Key: https://dashboard.stripe.com/apikeys
- Connect Client ID: https://dashboard.stripe.com/settings/applications

### Step 2: Deploy Backend (10 min)

#### Option A: Railway (Recommended - Easiest)

1. Go to https://railway.app
2. Sign up/login
3. **New Project** → **Deploy from GitHub**
4. Select your repository
5. **Settings** → **Root Directory** → Set to `server`
6. **Variables** → Add all variables from `server/.env`
7. Deploy!

Railway will give you a URL like: `https://your-app.railway.app`

#### Option B: Render

1. Go to https://render.com
2. **New Web Service**
3. Connect GitHub repo
4. **Settings:**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: `server`
5. Add environment variables
6. Deploy!

### Step 3: Update Frontend (2 min)

Update your frontend `.env`:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

Or if using Render:
```env
VITE_API_URL=https://your-app.onrender.com/api
```

### Step 4: Test It! (3 min)

1. Start your frontend: `npm run dev`
2. Make a test booking
3. Check your email! 📧

---

## 🔍 Verify Everything Works

### Test Backend Health:
```bash
curl https://your-backend.railway.app/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Test Email:
Make a booking and check:
- ✅ Guest receives confirmation email
- ✅ Host receives booking notification
- ✅ Guest receives payment receipt

---

## 📝 Current Status

✅ **Resend API Key**: Configured  
⏳ **Stripe Keys**: Need to add  
⏳ **Backend**: Ready to deploy  
✅ **Frontend**: Ready  

---

## 🆘 Troubleshooting

**Emails not sending?**
- Check Resend dashboard: https://resend.com/emails
- Verify API key is correct in backend `.env`
- Check backend logs for errors

**Backend won't start?**
- Check all environment variables are set
- Verify Node.js version (needs 18+)
- Check port 3001 is available

**Frontend can't connect?**
- Verify `VITE_API_URL` matches your backend URL
- Check CORS settings in backend
- Check browser console for errors

---

## 🎉 You're Almost There!

Once you:
1. ✅ Add Stripe keys
2. ✅ Deploy backend
3. ✅ Update frontend `.env`

**You'll be live and processing real payments!** 🚀
