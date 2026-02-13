# Production Setup Guide

This guide will help you set up Wattspot for production with real Stripe Connect integration.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Backend server (Node.js/Express recommended)
- Environment variables configured

## 1. Stripe Account Setup

### Create Stripe Account
1. Sign up at https://dashboard.stripe.com/register
2. Complete account verification
3. Get your API keys from https://dashboard.stripe.com/apikeys

### Enable Stripe Connect
1. Go to https://dashboard.stripe.com/settings/applications
2. Click "New application" to create a Connect application
3. Copy your Client ID (starts with `ca_`)

## 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_live_your_secret_key_here
VITE_API_URL=https://api.yourdomain.com/api

# Stripe Connect
VITE_STRIPE_CONNECT_CLIENT_ID=ca_your_connect_client_id_here

# Environment
VITE_ENV=production
```

**Important:** Never commit `.env` files to version control. Add `.env` to `.gitignore`.

## 3. Backend API Setup

You need a backend server to handle:
- Stripe Connect OAuth callbacks
- Payment intent creation with application fees
- Webhook handling for payment events

### Required API Endpoints

#### POST `/api/stripe/create-payment-intent`
Creates a payment intent with Stripe Connect split payments.

**Request:**
```json
{
  "amount": 10000,  // in cents
  "currency": "usd",
  "chargerId": "charger-123",
  "hostStripeAccountId": "acct_xxx",
  "bookingId": "booking-123",
  "applicationFeeAmount": 1200  // platform commission in cents
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### POST `/api/stripe/confirm-payment-intent`
Confirms a payment intent after successful payment.

**Request:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

#### GET `/api/stripe/connect/account/:hostId`
Gets Stripe Connect account status for a host.

**Response:**
```json
{
  "accountId": "acct_xxx",
  "email": "host@example.com",
  "isActive": true,
  "chargesEnabled": true,
  "payoutsEnabled": true
}
```

#### POST `/api/stripe/connect/onboarding`
Creates Stripe Connect onboarding link.

**Request:**
```json
{
  "hostId": "host-123",
  "returnUrl": "https://yourdomain.com/stripe-connect/callback"
}
```

#### POST `/api/stripe/connect/callback`
Handles Stripe Connect OAuth callback.

**Request:**
```json
{
  "code": "ac_xxx",
  "state": "host-123"
}
```

#### POST `/api/stripe/connect/disconnect/:hostId`
Disconnects a Stripe Connect account.

### Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Create payment intent with Connect
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, chargerId, hostStripeAccountId, bookingId, applicationFeeAmount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: hostStripeAccountId,
      },
      metadata: {
        chargerId,
        bookingId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stripe Connect OAuth callback
app.post('/api/stripe/connect/callback', async (req, res) => {
  try {
    const { code, state } = req.body;

    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    // Save connected account ID to database
    // await saveStripeAccount(state, response.stripe_user_id);

    res.json({
      accountId: response.stripe_user_id,
      email: response.stripe_publishable_key, // You'll need to fetch this separately
      isActive: true,
      chargesEnabled: true,
      payoutsEnabled: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook handler
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update booking status in database
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

## 4. Webhook Setup

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://api.yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`
5. Copy the webhook signing secret to your `.env` file

## 5. Frontend Build

```bash
npm install
npm run build
```

The built files will be in the `dist` directory.

## 6. Deployment Checklist

- [ ] Stripe account created and verified
- [ ] Stripe Connect application created
- [ ] Environment variables configured
- [ ] Backend API deployed and accessible
- [ ] Webhook endpoint configured in Stripe dashboard
- [ ] Frontend built and deployed
- [ ] SSL certificate installed (required for Stripe)
- [ ] CORS configured on backend
- [ ] Error logging set up
- [ ] Monitoring/analytics configured

## 7. Testing

### Test Mode
Use Stripe test mode keys for development:
- Test publishable key: `pk_test_...`
- Test secret key: `sk_test_...`
- Test cards: https://stripe.com/docs/testing

### Production Mode
Switch to live keys when ready:
- Live publishable key: `pk_live_...`
- Live secret key: `sk_live_...`

## 8. Security Considerations

- Never expose secret keys in frontend code
- Always use HTTPS in production
- Validate webhook signatures
- Implement rate limiting
- Use environment variables for sensitive data
- Regularly rotate API keys
- Monitor for suspicious activity

## 9. Support Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe Connect Guide: https://stripe.com/docs/connect
- Stripe Support: https://support.stripe.com

## Troubleshooting

### Payment fails
- Check Stripe dashboard for error details
- Verify host's Stripe account is active
- Ensure application fee is valid
- Check webhook logs

### Connect OAuth fails
- Verify redirect URI matches in Stripe dashboard
- Check client ID is correct
- Ensure backend callback endpoint is working

### Webhooks not received
- Verify webhook URL is accessible
- Check webhook signing secret
- Review webhook logs in Stripe dashboard
