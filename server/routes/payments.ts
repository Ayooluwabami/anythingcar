import express from 'express';
import Stripe from 'stripe';
import axios from 'axios';
import { auth } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe Payment Routes
router.post('/stripe/create-intent', auth, async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency || 'ngn',
      metadata,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Paystack Payment Routes
router.post('/paystack/initialize', auth, async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/paystack/verify/:reference', auth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${req.params.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Flutterwave Payment Routes
router.post('/flutterwave/initialize', auth, async (req, res) => {
  try {
    const { email, amount, currency, metadata } = req.body;

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: `tx-${Date.now()}`,
        amount,
        currency: currency || 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: {
          email,
        },
        customizations: {
          title: 'Anything Cars Payment',
          description: 'Payment for services',
        },
        meta: metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/flutterwave/verify/:transaction_id', auth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${req.params.transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;