# PlugSpot Backend API

Express.js server for handling Stripe payments, email notifications, and image uploads.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your API keys:**
   - Get Stripe keys from: https://dashboard.stripe.com/apikeys
   - Get Resend API key from: https://resend.com/api-keys
   - Get Stripe Connect Client ID from: https://dashboard.stripe.com/settings/applications

4. **Run the server:**
   ```bash
   npm start
   # Or for development:
   npm run dev
   ```

## Endpoints

### Email
- `POST /api/email/send` - Send email notification

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment

### Stripe Connect
- `GET /api/stripe-connect/oauth-url` - Get OAuth URL
- `POST /api/stripe-connect/callback` - Handle OAuth callback

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook endpoint

## Deployment

### Railway (Recommended)
1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Select this `server` directory
4. Add environment variables
5. Deploy!

### Render
1. Create account at https://render.com
2. New Web Service
3. Connect GitHub repo
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables

### Fly.io
1. Install Fly CLI
2. `fly launch` in server directory
3. Add secrets: `fly secrets set STRIPE_SECRET_KEY=...`
4. Deploy: `fly deploy`

## Environment Variables

See `.env.example` for all required variables.

## Testing

Test the health endpoint:
```bash
curl http://localhost:3001/health
```
