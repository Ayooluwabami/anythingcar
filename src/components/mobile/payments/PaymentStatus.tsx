import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'pending';
  message?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export function PaymentStatus({ status, message, onClose, onRetry }: PaymentStatusProps) {
  const statusConfig = {
    success: {
      icon: <CheckCircle className="h-16 w-16 text-green-500" />,
      title: 'Payment Successful',
      buttonText: 'Done',
    },
    failed: {
      icon: <XCircle className="h-16 w-16 text-red-500" />,
      title: 'Payment Failed',
      buttonText: 'Try Again',
    },
    pending: {
      icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
      title: 'Payment Pending',
      buttonText: 'Check Status',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-4">
      {config.icon}
      <h2 className="text-xl font-semibold mt-4">{config.title}</h2>
      {message && <p className="text-gray-600 text-center mt-2">{message}</p>}
      
      <div className="flex flex-col w-full gap-3 mt-8">
        {status === 'failed' && onRetry && (
          <Button onClick={onRetry} variant="default">
            Try Again
          </Button>
        )}
        <Button 
          onClick={onClose}
          variant={status === 'failed' ? 'outline' : 'default'}
        >
          {config.buttonText}
        </Button>
      </div>
    </div>
  );
}