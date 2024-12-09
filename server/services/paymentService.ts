import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const paymentService = {
  async createStripePayment(amount: number, currency: string = 'usd') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  },

  async createPaystackPayment(amount: number, email: string) {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return {
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
    };
  },

  async createFlutterwavePayment(amount: number, email: string, phone: string) {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: `tx-${Date.now()}`,
        amount,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: {
          email,
          phone_number: phone,
        },
        customizations: {
          title: 'Anything Cars Payment',
          description: 'Payment for services',
          logo: 'https://yourdomain.com/logo.png',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return {
      paymentLink: response.data.data.link,
      transactionId: response.data.data.id,
    };
  },

  async verifyPaystackPayment(reference: string) {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return {
      status: response.data.data.status,
      amount: response.data.data.amount / 100,
    };
  },

  async verifyFlutterwavePayment(transactionId: string) {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return {
      status: response.data.data.status,
      amount: response.data.data.amount,
    };
  },
};