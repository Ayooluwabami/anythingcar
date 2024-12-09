import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { useFlutterwave } from 'flutterwave-react-v3';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function PaymentModal({ amount, email, onSuccess, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const amountInKobo = amount * 100;

  // Paystack configuration
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email,
    amount: amountInKobo,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
  };

  // Flutterwave configuration
  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount,
    currency: 'NGN',
    payment_options: 'card,ussd,bank_transfer',
    customer: {
      email,
    },
    customizations: {
      title: 'Anything Cars Payment',
      description: 'Payment for services',
      logo: 'https://your-logo-url.com',
    },
  };

  const initializePaystack = usePaystackPayment(paystackConfig);
  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // Stripe Elements integration would go here
          },
          billing_details: {
            email,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSuccess();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
        <p className="text-gray-600 mb-6">
          Amount to pay: ₦{amount.toLocaleString()}
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => initializePaystack()}
            className="w-full"
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with Paystack
          </Button>

          <Button
            onClick={() => handleFlutterPayment({ callback: onSuccess })}
            className="w-full"
            disabled={loading}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Pay with Flutterwave
          </Button>

          <Button
            onClick={handleStripePayment}
            className="w-full"
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with Card (Stripe)
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Note: Cancellation after payment will incur a 10% fee.
        </p>
      </div>
    </div>
  );
}