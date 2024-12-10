import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/paymentService';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard } from 'lucide-react';

const paymentSchema = z.object({
  paymentMethod: z.enum(['stripe', 'paystack', 'flutterwave']),
  saveCard: z.boolean().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  amount: number;
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
  metadata?: Record<string, any>;
}

export function PaymentForm({ amount, email, onCancel, metadata }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'stripe',
      saveCard: false,
    },
  });

  const handlePayment = async (data: PaymentFormData) => {
    setLoading(true);
    try {
      switch (data.paymentMethod) {
        case 'stripe':
          await paymentService.initializeStripePayment({
            amount,
            email,
            metadata,
          });
          // Handle Stripe payment flow
          break;

        case 'paystack':
          const paystackData = await paymentService.initializePaystackPayment({
            amount,
            email,
            metadata,
          });
          window.location.href = paystackData.authorization_url;
          break;

        case 'flutterwave':
          const flutterwaveData = await paymentService.initializeFlutterwavePayment({
            amount,
            email,
            metadata,
          });
          window.location.href = flutterwaveData.link;
          break;
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Amount to Pay</h3>
        <p className="text-2xl font-bold">₦{amount.toLocaleString()}</p>
      </div>

      <div className="space-y-4">
        <label className="block font-medium">Select Payment Method</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="stripe"
              {...register('paymentMethod')}
              className="form-radio"
            />
            <span>Pay with Card (Stripe)</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="paystack"
              {...register('paymentMethod')}
              className="form-radio"
            />
            <span>Pay with Paystack</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="radio"
              value="flutterwave"
              {...register('paymentMethod')}
              className="form-radio"
            />
            <span>Pay with Flutterwave</span>
          </label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('saveCard')}
          className="form-checkbox"
        />
        <label className="text-sm">Save card for future payments</label>
      </div>

      <div className="flex space-x-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Note: Cancellation after payment will incur a 10% fee.
      </p>
    </form>
  );
}