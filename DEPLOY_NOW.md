# 🚀 Deploy PlugSpot for Free - Step by Step

## Option 1: Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub

1. **Create a GitHub account** (if you don't have one): https://github.com/signup

2. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it: `plugspot` (or any name)
   - Make it **Public** or **Private** (your choice)
   - **Don't** initialize with README
   - Click "Create repository"

3. **Push your code to GitHub:**
   ```bash
   # In your terminal, run these commands:
   git remote add origin https://github.com/YOUR_USERNAME/plugspot.git
   git branch -M main
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your GitHub username)

### Step 2: Deploy to Vercel

1. **Go to https://vercel.com**
2. **Click "Sign Up"** → Choose "Continue with GitHub"
3. **Authorize Vercel** to access your GitHub
4. **Click "Add New Project"**
5. **Import your repository** (select `plugspot`)
6. **Vercel auto-detects Vite** - settings should be:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build` (auto)
   - Output Directory: `dist` (auto)
7. **Click "Deploy"**

### Step 3: Add Environment Variables (Initial)

**After the first deploy completes:**

1. Go to your project in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables (one at a time):

   ```
   Name: VITE_STRIPE_PUBLISHABLE_KEY
   Value: pk_live_YOUR_PUBLISHABLE_KEY_HERE
   Environment: Production, Preview, Development (select all)
   ```
   (Get your publishable key from: https://dashboard.stripe.com/apikeys)

   ```
   Name: VITE_API_URL
   Value: http://localhost:3001/api
   Environment: Production, Preview, Development (select all)
   ```

   ```
   Name: VITE_ENV
   Value: production
   Environment: Production, Preview, Development (select all)
   ```

   **Note:** Skip `VITE_STRIPE_CONNECT_CLIENT_ID` for now - you'll add it after getting your website URL!

4. Click **"Save"** for each variable
5. Go to **"Deployments"** tab
6. Click the **"..."** menu on the latest deployment
7. Click **"Redeploy"**

### Step 4: Get Your Stripe Connect Client ID

**Now that your site is live:**

1. **Copy your Vercel URL** (e.g., `https://your-project.vercel.app`)

2. **Go to Stripe Dashboard:**
   - https://dashboard.stripe.com/settings/applications
   - Click **"Connect"** in the left sidebar
   - Click **"Get started"** or **"Create application"**

3. **Fill in the Connect application form:**
   - **Application name:** PlugSpot (or your app name)
   - **Website URL:** `https://your-project.vercel.app` (your Vercel URL)
   - **Redirect URI:** `https://your-project.vercel.app/stripe-connect/callback`
   - **Support email:** Your email

4. **After creating the application:**
   - Copy the **Client ID** (starts with `ca_...`)

5. **Add it to Vercel:**
   - Go back to Vercel → Settings → Environment Variables
   - Add:
     ```
     Name: VITE_STRIPE_CONNECT_CLIENT_ID
     Value: ca_... (your client ID from Stripe)
     Environment: Production, Preview, Development (select all)
     ```
   - Click **"Save"**
   - **Redeploy** your site

### ✅ Done!

Your site is now fully configured with Stripe Connect!

### ✅ Done!

Your site is now live at: `https://your-project-name.vercel.app`

**Vercel gives you:**
- ✅ Free HTTPS
- ✅ Free CDN (fast worldwide)
- ✅ Auto-deploy on every git push
- ✅ Free custom domain support
- ✅ Preview deployments for pull requests

---

## Option 2: Netlify (Alternative)

1. **Push to GitHub** (same as Step 1 above)
2. **Go to https://www.netlify.com**
3. **Sign up with GitHub**
4. **Click "Add new site" → "Import an existing project"**
5. **Select your GitHub repository**
6. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
7. **Click "Deploy site"**
8. **Add environment variables** in Site settings → Environment variables
9. **Redeploy**

---

## Option 3: Cloudflare Pages

1. **Push to GitHub** (same as Step 1 above)
2. **Go to https://pages.cloudflare.com**
3. **Sign up** (free)
4. **Connect GitHub** → Select repository
5. **Build settings:**
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
6. **Deploy**
7. **Add environment variables** in Settings → Environment variables

---

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel/Netlify/Cloudflare
- [ ] Environment variables added
- [ ] Site is live and working
- [ ] Test all features

---

## 💡 Pro Tips

1. **Test build locally first:**
   ```bash
   npm run build
   ```
   If this works, deployment will work!

2. **Check deployment logs** if something fails

3. **Custom domain** (optional):
   - Vercel: Settings → Domains → Add domain
   - Free SSL certificate included!

4. **Auto-deploy**: Every time you push to GitHub, Vercel automatically redeploys

---

## 🆘 Troubleshooting

**Build fails?**
- Check the build logs in Vercel dashboard
- Make sure `npm run build` works locally
- Check for TypeScript errors: `npm run build`

**Environment variables not working?**
- Make sure they start with `VITE_`
- Redeploy after adding variables
- Check variable names match exactly

**Site works but Stripe doesn't?**
- Verify publishable key is correct
- Check browser console for errors
- Make sure backend API is deployed (if using)

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Cloudflare Pages: https://developers.cloudflare.com/pages
