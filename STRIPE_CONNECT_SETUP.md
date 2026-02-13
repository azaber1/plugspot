# 🔗 Setting Up Stripe Connect (After Deployment)

## Why You Need Your Website First

Stripe requires a **website URL** when creating a Connect application. This is why you need to deploy your site first, then get the Connect client ID.

## Step-by-Step Process

### 1. Deploy Your Site First ✅

Deploy to Vercel (or your hosting platform) following `DEPLOY_NOW.md`. You'll get a URL like:
- `https://your-project.vercel.app`

### 2. Get Your Stripe Connect Client ID

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/settings/applications
   - Or: Dashboard → Settings → Connect → Applications

2. **Create a Connect Application:**
   - Click **"Create application"** or **"Get started"**
   - Fill in:
     - **Application name:** PlugSpot (or your app name)
     - **Website URL:** `https://your-project.vercel.app` ⬅️ Your deployed site
     - **Redirect URI:** `https://your-project.vercel.app/stripe-connect/callback`
     - **Support email:** Your email address

3. **Copy Your Client ID:**
   - After creating, you'll see a **Client ID** (starts with `ca_...`)
   - Copy this value

### 3. Add Client ID to Your Deployed Site

1. **Go to Vercel Dashboard:**
   - Your project → Settings → Environment Variables

2. **Add the variable:**
   ```
   Name: VITE_STRIPE_CONNECT_CLIENT_ID
   Value: ca_... (paste your client ID here)
   Environment: Production, Preview, Development (select all)
   ```

3. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

### 4. Test It Out

1. Visit your deployed site
2. Log in as a host
3. Go to Dashboard → Payment Settings
4. Click "Connect Stripe Account"
5. You should be redirected to Stripe's OAuth flow

## ⚠️ Important Notes

- **The app works fine without the Connect client ID** - hosts just won't be able to connect Stripe accounts yet
- **Stripe account verification** may take 24-48 hours after creating the Connect app
- **Test mode vs Live mode:** Make sure you're using the right Stripe keys (test vs live)

## 🆘 Troubleshooting

**"Connect application not found"**
- Make sure you copied the Client ID correctly
- Check that you're using the right Stripe account (test vs live)

**"Redirect URI mismatch"**
- Make sure the redirect URI in Stripe matches exactly: `https://your-site.com/stripe-connect/callback`
- Include the full URL with `https://`

**"Account verification pending"**
- This is normal - Stripe reviews new Connect applications
- You can still use the app, just Connect features will be limited

## 📚 Resources

- Stripe Connect Docs: https://stripe.com/docs/connect
- Stripe Dashboard: https://dashboard.stripe.com
