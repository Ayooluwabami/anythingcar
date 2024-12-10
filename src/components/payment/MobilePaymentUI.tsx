import { useState } from 'react';
import { CreditCard, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaystackPayment } from 'react-paystack';
import { useFlutterwave } from 'flutterwave-react-v3';

interface MobilePaymentUIProps {
  amount: number;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function MobilePaymentUI({ amount, email, onSuccess, onClose }: MobilePaymentUIProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount,
    currency: 'NGN',
    payment_options: 'card,ussd,bank_transfer',
    customer: { email, phonenumber: '', name: '' },
    customizations: {
      title: 'Anything Cars Payment',
      description: 'Payment for services',
      logo: 'https://anythingcar.com/logo.png',
    },
  };

  const initializePaystack = usePaystackPayment(paystackConfig);
  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      id: 'paystack',
      name: 'Paystack',
      icon: <span className="h-6 w-6 text-lg text-gray-900">₦</span>,
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: <span className="h-6 w-6 text-lg text-gray-900">₦</span>,
    },

  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      switch (selectedMethod) {
        case 'paystack':
          initializePaystack({
            onSuccess,
            onClose,
          });
          break;
        case 'flutterwave':
          handleFlutterPayment({ callback: onSuccess, onClose });
          break;
        case 'card':
          // Handle direct card payment
          break;
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Payment</h2>

        <div className="mb-8">
          <p className="text-gray-600">Amount to Pay</p>
          <p className="text-3xl font-bold">₦{amount.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
          <p className="font-medium mb-2">Select Payment Method</p>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border ${selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
                }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">{method.icon}</div>
                <span className="font-medium">{method.name}</span>
              </div>
              {selectedMethod === method.id ? (
                <Check className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || loading}
            className="w-full"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full mt-2"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}