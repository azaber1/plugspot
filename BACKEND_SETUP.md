# 🚀 Backend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up Environment Variables

Create `server/.env` file:

```env
PORT=3001

# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_CONNECT_CLIENT_ID=ca_YOUR_CLIENT_ID_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Resend Email API (get from https://resend.com/api-keys)
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
```

### 3. Run the Server

```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:3001`

## Deploy to Railway (Recommended)

1. **Create Railway account:** https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Select repository** → **Set root directory to `server`**
4. **Add environment variables** in Railway dashboard
5. **Deploy!**

Railway will give you a URL like: `https://your-app.railway.app`

Update your frontend `.env`:
```
VITE_API_URL=https://your-app.railway.app/api
```

## Deploy to Render

1. **Create Render account:** https://render.com
2. **New Web Service**
3. **Connect GitHub** → Select repo
4. **Settings:**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: `server`
5. **Add environment variables**
6. **Deploy!**

## Get API Keys

### Resend (Email)
1. Sign up: https://resend.com
2. Go to API Keys
3. Create new key
4. Copy to `RESEND_API_KEY`

### Stripe Webhook Secret
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Testing

Test the API:

```bash
# Health check
curl http://localhost:3001/health

# Test email (replace with your email)
curl -X POST http://localhost:3001/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your@email.com",
    "subject": "Test",
    "html": "<h1>Test email</h1>"
  }'
```

## Frontend Configuration

Update your frontend `.env`:

```env
VITE_API_URL=http://localhost:3001/api  # For local dev
# Or for production:
VITE_API_URL=https://your-backend.railway.app/api
```

## Troubleshooting

**Server won't start?**
- Check Node.js version: `node --version` (needs 18+)
- Check if port 3001 is available
- Verify all environment variables are set

**Emails not sending?**
- Check Resend API key is correct
- Check Resend dashboard for errors
- Verify email address format

**Stripe errors?**
- Verify secret key is correct
- Check Stripe dashboard for API errors
- Ensure webhook secret matches
