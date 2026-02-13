# Backend Environment Variables

## ⚠️ IMPORTANT: Secret Key Location

The Stripe **secret key** should **ONLY** be in your **backend server's** `.env` file, NOT in the frontend.

## Backend Server `.env` File

Create a `.env` file in your **backend server** directory with:

```env
# Stripe Secret Key - BACKEND ONLY!
# Get this from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE

# Stripe Publishable Key (for reference, but frontend has it)
# Get this from: https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE

# Server Port
PORT=3001

# Other backend config...
```

## Frontend `.env` File

The frontend `.env` file (already created) contains:
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY` - Safe to expose
- ❌ NO secret key - Never put secret keys in frontend!

## Security Reminders

1. **Never commit `.env` files to git**
2. **Secret keys only in backend**
3. **Publishable keys are safe for frontend**
4. **Add `.env` to `.gitignore` in both frontend and backend**
