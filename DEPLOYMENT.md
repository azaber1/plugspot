# Free Deployment Guide

## 🚀 Recommended: Vercel (Easiest & Best for React/Vite)

Vercel is the easiest and best option for deploying React/Vite apps. It's free and takes about 5 minutes.

### Step 1: Prepare Your Code

1. **Make sure your code is on GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Build locally to test:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder - make sure it builds without errors.

### Step 2: Deploy to Vercel

1. **Go to https://vercel.com**
2. **Sign up** with GitHub (free)
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
6. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add each variable:
     - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
     - `VITE_API_URL` = `https://your-backend-api.com/api`
     - `VITE_STRIPE_CONNECT_CLIENT_ID` = `ca_...`
     - `VITE_ENV` = `production`
7. **Click "Deploy"**

### Step 3: Your Site is Live!

- Vercel gives you a free URL like: `your-app.vercel.app`
- Automatic HTTPS
- Free custom domain support
- Automatic deployments on every git push

---

## 🌐 Alternative: Netlify

### Step 1: Prepare Code
Same as Vercel - push to GitHub

### Step 2: Deploy
1. Go to https://www.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site settings → Environment variables
7. Deploy!

---

## 📦 Alternative: GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/plugspot"
}
```

### Step 3: Deploy
```bash
npm run deploy
```

**Note:** GitHub Pages doesn't support environment variables easily. You'd need to use a different approach for secrets.

---

## ☁️ Alternative: Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Sign up (free)
3. Connect GitHub repository
4. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add environment variables
6. Deploy!

---

## 🔧 Environment Variables Setup

### For Vercel/Netlify:

1. Go to your project settings
2. Find "Environment Variables" section
3. Add each variable:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_API_URL=https://your-backend.com/api
   VITE_STRIPE_CONNECT_CLIENT_ID=ca_...
   VITE_ENV=production
   ```
4. Redeploy after adding variables

### Important Notes:
- ⚠️ **Never commit `.env` files** - they're already in `.gitignore`
- ✅ Environment variables are secure in Vercel/Netlify
- ✅ They're only available at build time
- ✅ Your secret Stripe key should stay in your backend only

---

## 🎯 Recommended Setup

**Frontend (Free):**
- **Vercel** - Best option, easiest setup
- Automatic HTTPS
- Free custom domain
- Auto-deploy on git push

**Backend (You'll need this for Stripe):**
- **Render** (free tier) - https://render.com
- **Railway** (free tier) - https://railway.app
- **Fly.io** (free tier) - https://fly.io
- **Heroku** (has free tier with limitations)

---

## 📝 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] `npm run build` works locally
- [ ] Environment variables ready
- [ ] Backend API deployed (for Stripe)
- [ ] Stripe keys configured
- [ ] Deploy to Vercel/Netlify
- [ ] Test the live site
- [ ] Add custom domain (optional)

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Vercel/Netlify dashboard
- Make sure all dependencies are in `package.json`
- Try building locally first: `npm run build`

### Environment Variables Not Working
- Make sure they start with `VITE_` for Vite
- Redeploy after adding variables
- Check variable names match exactly

### Stripe Not Working
- Verify publishable key is correct
- Make sure backend API is deployed
- Check browser console for errors

---

## 🎉 After Deployment

1. **Test everything:**
   - Browse chargers
   - Create account
   - List charger
   - Test booking flow

2. **Monitor:**
   - Check Vercel/Netlify dashboard for errors
   - Monitor Stripe dashboard for payments
   - Set up error tracking (optional)

3. **Custom Domain (Optional):**
   - Vercel: Settings → Domains → Add domain
   - Netlify: Domain settings → Add custom domain
   - Both are free!

---

## 💡 Pro Tips

1. **Use Vercel** - It's the easiest and best for React/Vite
2. **Enable auto-deploy** - Every push to main deploys automatically
3. **Use preview deployments** - Test before merging to main
4. **Monitor performance** - Vercel shows analytics
5. **Set up staging** - Use a separate branch for testing

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
