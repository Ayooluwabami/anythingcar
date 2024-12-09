import { Loader2 } from 'lucide-react';

interface PaymentProcessingProps {
  message?: string;
}

export function PaymentProcessing({ message = 'Processing your payment...' }: PaymentProcessingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
      <p className="text-lg font-medium text-center">{message}</p>
      <p className="text-sm text-gray-500 text-center mt-2">
        Please don't close this window
      </p>
    </div>
  );
}