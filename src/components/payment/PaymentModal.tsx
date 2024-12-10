import { useState } from 'react';
import { CardElement, Elements, useElements } from '@stripe/react-stripe-js';
import { usePaystackPayment } from 'react-paystack';
import { useFlutterwave } from 'flutterwave-react-v3';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

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
      phonenumber: '',
      name: '',
    },
    customizations: {
      title: 'Anything Cars Payment',
      description: 'Payment for services',
      logo: 'https://anythingcar.com',
    },
  };

  const initializePaystack = usePaystackPayment(paystackConfig);
  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);
  const elements = useElements();

  const handleStripePayment = async () => {
    const cardElement = elements?.getElement(CardElement);
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
          card: cardElement!,
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
      <Elements stripe={stripePromise}>
        <CardElement />
      </Elements>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
        <p className="text-gray-600 mb-6">
          Amount to pay: ₦{amount.toLocaleString()}
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => initializePaystack({
              onSuccess,
              onClose
            })}
            className="w-full"
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with Paystack
          </Button>

          <Button
            onClick={() => handleFlutterPayment({ callback: onSuccess, onClose })}
            className="w-full"
            disabled={loading}
          >
            <span className="mr-2 h-4 w-4">₦</span>
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