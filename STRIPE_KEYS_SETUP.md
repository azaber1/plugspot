# Stripe Keys Setup Guide

## ✅ What I've Done

1. Created `.env` file in the frontend (already in `.gitignore`)
2. Created `BACKEND_ENV_SETUP.md` with backend instructions

## 🔑 Getting Your Keys

### Step 1: Get Your Publishable Key

1. Go to https://dashboard.stripe.com/apikeys
2. Find your **Publishable key** (starts with `pk_live_`)
3. It's shown right next to your secret key
4. Copy it and update the `.env` file

### Step 2: Update Frontend `.env`

Edit `.env` and replace `YOUR_PUBLISHABLE_KEY_HERE` with your actual publishable key:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY
```

### Step 3: Backend Setup

Your **backend server** needs the secret key. See `BACKEND_ENV_SETUP.md` for details.

**Secret Key (Backend Only):**
```
Get this from: https://dashboard.stripe.com/apikeys
sk_live_YOUR_SECRET_KEY_HERE
```

## 📝 Quick Reference

- **Publishable Key** (`pk_live_...`) → Frontend `.env` ✅
- **Secret Key** (`sk_live_...`) → Backend `.env` only ❌
- **Never** put secret keys in frontend code
- **Never** commit `.env` files to git

## 🔒 Security

- ✅ `.env` is in `.gitignore` - won't be committed
- ✅ Frontend only uses publishable key (safe)
- ✅ Secret key stays in backend only
