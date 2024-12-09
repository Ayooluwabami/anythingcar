import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentConfig {
  amount: number;
  email: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export const paymentService = {
  async initializeStripePayment(config: PaymentConfig) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await axios.post('/api/payments/stripe/create-intent', {
        amount: config.amount,
        currency: config.currency || 'NGN',
        metadata: config.metadata,
      });

      const { clientSecret } = response.data;
      return { stripe, clientSecret };
    } catch (error) {
      throw new Error('Failed to initialize Stripe payment');
    }
  },

  async initializePaystackPayment(config: PaymentConfig) {
    try {
      const response = await axios.post('/api/payments/paystack/initialize', {
        email: config.email,
        amount: config.amount * 100, // Convert to kobo
        metadata: config.metadata,
      });

      return response.data.data;
    } catch (error) {
      throw new Error('Failed to initialize Paystack payment');
    }
  },

  async initializeFlutterwavePayment(config: PaymentConfig) {
    try {
      const response = await axios.post('/api/payments/flutterwave/initialize', {
        email: config.email,
        amount: config.amount,
        currency: config.currency || 'NGN',
        metadata: config.metadata,
      });

      return response.data.data;
    } catch (error) {
      throw new Error('Failed to initialize Flutterwave payment');
    }
  },

  async verifyPayment(provider: string, reference: string) {
    try {
      const response = await axios.get(`/api/payments/${provider}/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  },
};