// Email service for sending notifications
// Uses Resend API (free tier: 3,000 emails/month)

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Send email via backend API (recommended for production)
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Email service error:', error);
    // In development, log the email instead of failing
    if (import.meta.env.DEV) {
      console.log('📧 Email (dev mode):', options);
      return true;
    }
    return false;
  }
};

// Email templates
export const emailTemplates = {
  bookingConfirmationGuest: (booking: {
    chargerAddress: string;
    startTime: string;
    endTime: string;
    totalCost: number;
    bookingId: string;
  }) => ({
    subject: 'Booking Confirmed - PlugSpot',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00ff88; color: #000; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #00ff88; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Your charging session has been confirmed!</p>
              <div class="details">
                <p><strong>Location:</strong> ${booking.chargerAddress}</p>
                <p><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
                <p><strong>Total Cost:</strong> $${booking.totalCost.toFixed(2)}</p>
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              </div>
              <p>We'll send you a reminder 24 hours before your booking.</p>
              <a href="${window.location.origin}/booking/${booking.bookingId}/confirm" class="button">View Booking Details</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  bookingConfirmationHost: (booking: {
    guestName: string;
    chargerAddress: string;
    startTime: string;
    endTime: string;
    hostEarnings: number;
    bookingId: string;
  }) => ({
    subject: 'New Booking - PlugSpot',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00ff88; color: #000; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #00ff88; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .earnings { background: #00ff88; color: #000; padding: 15px; border-radius: 5px; margin: 15px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 New Booking!</h1>
            </div>
            <div class="content">
              <p>Great news! Someone just booked your charger.</p>
              <div class="details">
                <p><strong>Guest:</strong> ${booking.guestName}</p>
                <p><strong>Location:</strong> ${booking.chargerAddress}</p>
                <p><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> ${new Date(booking.endTime).toLocaleString()}</p>
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              </div>
              <div class="earnings">
                <p>You'll earn: $${booking.hostEarnings.toFixed(2)}</p>
                <p>(After platform commission)</p>
              </div>
              <a href="${window.location.origin}/dashboard" class="button">View Dashboard</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  bookingReminder: (booking: {
    chargerAddress: string;
    startTime: string;
    bookingId: string;
  }) => ({
    subject: 'Reminder: Your Charging Session is Tomorrow - PlugSpot',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00ff88; color: #000; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #00ff88; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Reminder: Booking Tomorrow</h1>
            </div>
            <div class="content">
              <p>This is a reminder that you have a charging session scheduled for tomorrow.</p>
              <div class="details">
                <p><strong>Location:</strong> ${booking.chargerAddress}</p>
                <p><strong>Start Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
              </div>
              <a href="${window.location.origin}/booking/${booking.bookingId}/confirm" class="button">View Booking</a>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  paymentReceipt: (booking: {
    bookingId: string;
    totalCost: number;
    date: string;
  }) => ({
    subject: 'Payment Receipt - PlugSpot',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00ff88; color: #000; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧾 Payment Receipt</h1>
            </div>
            <div class="content">
              <p>Thank you for your payment!</p>
              <div class="details">
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Amount:</strong> $${booking.totalCost.toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date(booking.date).toLocaleString()}</p>
              </div>
              <p>This email serves as your receipt.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
