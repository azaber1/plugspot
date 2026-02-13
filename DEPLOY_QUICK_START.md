# 🚀 Quick Deploy to Vercel (5 Minutes)

## Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Use GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. Vercel auto-detects Vite - just click **"Deploy"**

## Step 3: Add Environment Variables

After first deploy, go to **Settings → Environment Variables** and add:

```
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_PUBLISHABLE_KEY_HERE
VITE_API_URL = https://your-backend-api.com/api
VITE_STRIPE_CONNECT_CLIENT_ID = (your connect client ID)
VITE_ENV = production
```

Then click **"Redeploy"**

## ✅ Done!

Your site is live at: `your-app.vercel.app`

**That's it!** Vercel handles everything automatically:
- ✅ HTTPS
- ✅ CDN
- ✅ Auto-deploy on every git push
- ✅ Free custom domain

---

## 🎯 Next Steps

1. **Deploy your backend API** (for Stripe payments)
   - Use Render, Railway, or Fly.io (all have free tiers)
   - Update `VITE_API_URL` in Vercel

2. **Add custom domain** (optional)
   - Vercel → Settings → Domains
   - Add your domain (free!)

3. **Test everything**
   - Make sure Stripe works
   - Test booking flow
   - Check all features

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Check build logs in Vercel dashboard
- Make sure `npm run build` works locally first
