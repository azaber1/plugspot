# ⚠️ SECURITY WARNING

## Your Stripe Secret Key Was Exposed

**IMMEDIATE ACTION REQUIRED:**

1. **Revoke the exposed key immediately:**
   - Go to https://dashboard.stripe.com/apikeys
   - Find and revoke the key ending in `...2tXVlp00G2ylTfSn`
   - This key is now compromised and should NEVER be used again

2. **Generate a new secret key:**
   - After revoking, create a new secret key
   - Store it securely in `.env` file (see below)

3. **Check for unauthorized activity:**
   - Review your Stripe dashboard for any suspicious charges
   - Monitor your account activity
   - Consider enabling additional security measures

## How to Set Up Keys Securely

### Step 1: Create `.env` file
Create a `.env` file in the root directory (it's already in `.gitignore`):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_new_publishable_key
VITE_STRIPE_SECRET_KEY=sk_live_your_new_secret_key
VITE_STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id
VITE_API_URL=http://localhost:3001/api
VITE_ENV=production
```

### Step 2: Important Notes

- ✅ `.env` is in `.gitignore` - it will NOT be committed to git
- ❌ NEVER share secret keys in chat, email, or code
- ❌ NEVER commit `.env` files to version control
- ✅ Only use publishable keys in frontend code
- ✅ Secret keys should ONLY be used in backend/server code

### Step 3: For Frontend (Vite)

**Important:** The frontend should ONLY use the publishable key (`pk_live_...`). 

The secret key (`sk_live_...`) should **ONLY** be used in your backend API server, NOT in the frontend code.

Your frontend code uses `VITE_STRIPE_PUBLISHABLE_KEY` which is safe to expose.

### Step 4: Backend Setup

Your backend server should:
- Read `STRIPE_SECRET_KEY` from environment variables
- NEVER expose the secret key to the frontend
- Use the secret key only for server-side operations

## Best Practices

1. **Rotate keys regularly**
2. **Use different keys for test and production**
3. **Monitor Stripe dashboard for unusual activity**
4. **Use Stripe's webhook signature verification**
5. **Never log secret keys**
6. **Use environment variables, never hardcode keys**

## If You Suspect Compromise

1. Revoke all keys immediately
2. Generate new keys
3. Review all recent transactions
4. Contact Stripe support if needed
5. Check your codebase for any committed keys

## Resources

- Stripe Security: https://stripe.com/docs/security
- API Keys: https://dashboard.stripe.com/apikeys
- Webhook Security: https://stripe.com/docs/webhooks/signatures
