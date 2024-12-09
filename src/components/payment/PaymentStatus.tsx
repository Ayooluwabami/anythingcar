import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { paymentService } from '@/services/paymentService';

interface PaymentStatusProps {
  reference: string;
  provider: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export function PaymentStatus({ reference, provider, onSuccess, onFailure }: PaymentStatusProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const result = await paymentService.verifyPayment(provider, reference);
      
      if (result.status === 'success') {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
        });
        onSuccess?.();
      } else {
        toast({
          title: 'Payment Failed',
          description: 'Your payment could not be processed.',
          variant: 'destructive',
        });
        onFailure?.();
      }
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Unable to verify payment status.',
        variant: 'destructive',
      });
      onFailure?.();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
      <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
      <p className="text-gray-600 mb-6">Please wait while we confirm your payment...</p>
      <Button onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
}