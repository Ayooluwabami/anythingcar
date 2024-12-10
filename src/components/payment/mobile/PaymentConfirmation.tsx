import { useState } from 'react';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentSummary } from './PaymentSummary';
import { Button } from '@/components/ui/button';

interface PaymentConfirmationProps {
  amount: number;
  onConfirm: (method: string) => void;
  onCancel: () => void;
}

export function PaymentConfirmation({
  amount,
  onConfirm,
  onCancel
}: PaymentConfirmationProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card' as const },
    { id: 'paystack', name: 'Paystack', icon: 'paystack' as const },
    { id: 'flutterwave', name: 'Flutterwave', icon: 'flutterwave' as const },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 space-y-6">
        <PaymentSummary amount={amount} />

        <div className="space-y-4">
          <h3 className="font-medium">Select Payment Method</h3>
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              {...method}
              selected={selectedMethod === method.id}
              onSelect={setSelectedMethod}
            />
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="space-y-3">
          <Button
            onClick={() => onConfirm(selectedMethod)}
            disabled={!selectedMethod}
            className="w-full"
          >
            Pay Now
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}