// Express.js backend server for PlugSpot
// Handles: Stripe payments, email sending, image uploads

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - Allow all origins for now (you can restrict later)
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Email endpoint
app.post('/api/email/send', async (req, res) => {
  try {
    const { to, subject, html, from = 'PlugSpot <onboarding@resend.dev>' } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Stripe payment intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const {
      amount,
      currency = 'usd',
      hostStripeAccountId,
      chargerId,
      bookingId,
      metadata = {},
    } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        chargerId,
        bookingId,
        hostStripeAccountId: hostStripeAccountId || '',
        ...metadata,
      },
      // If host has Stripe Connect account, use on_behalf_of
      ...(hostStripeAccountId && {
        on_behalf_of: hostStripeAccountId,
        transfer_data: {
          destination: hostStripeAccountId,
        },
      }),
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment intent' });
  }
});

// Confirm payment intent
app.post('/api/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        status: paymentIntent.status,
        error: 'Payment not completed',
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: error.message || 'Failed to confirm payment' });
  }
});

// Stripe Connect OAuth URL
app.get('/api/stripe-connect/oauth-url', async (req, res) => {
  try {
    const { hostId, returnUrl } = req.query;

    if (!hostId || !returnUrl) {
      return res.status(400).json({ error: 'hostId and returnUrl required' });
    }

    const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: 'Stripe Connect not configured' });
    }

    const oauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(returnUrl)}&state=${hostId}`;

    res.json({ oauthUrl });
  } catch (error) {
    console.error('OAuth URL error:', error);
    res.status(500).json({ error: 'Failed to generate OAuth URL' });
  }
});

// Get Stripe Connect account status
app.get('/api/stripe-connect/account/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;
    
    // In a real app, you'd look up the Stripe account from your database
    // For now, return null (account not connected)
    // This endpoint exists to prevent 404 errors
    res.status(404).json({ error: 'Account not found' });
  } catch (error) {
    console.error('Error getting Stripe Connect account:', error);
    res.status(500).json({ error: 'Failed to get Stripe Connect account' });
  }
});

// Stripe Connect callback
app.post('/api/stripe-connect/callback', async (req, res) => {
  try {
    const { code, state: hostId } = req.body;

    if (!code || !hostId) {
      return res.status(400).json({ error: 'code and state required' });
    }

    // Exchange code for access token
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    res.json({
      accountId: response.stripe_user_id,
      email: response.stripe_user_id, // You might want to fetch account details
      isActive: true,
      chargesEnabled: true,
    });
  } catch (error) {
    console.error('Stripe Connect callback error:', error);
    res.status(500).json({ error: error.message || 'Failed to connect Stripe account' });
  }
});

// Webhook endpoint for Stripe events
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update booking status, send confirmation emails, etc.
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PlugSpot API server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.RESEND_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Not configured'}`);
});
