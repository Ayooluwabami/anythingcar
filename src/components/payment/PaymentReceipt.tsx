import { useRef } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatCurrency';

interface PaymentReceiptProps {
  payment: {
    _id: string;
    amount: number;
    createdAt: string;
    reference: string;
    status: string;
    metadata?: {
      bookingId?: string;
      vehicleName?: string;
      customerName?: string;
    };
  };
  onClose: () => void;
}

export function PaymentReceipt({ payment, onClose }: PaymentReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'width=600,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div ref={receiptRef} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Payment Receipt</h2>
            <p className="text-gray-600">Thank you for your payment</p>
          </div>

          <div className="border-t border-b py-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{payment._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-medium">{payment.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(payment.createdAt).toLocaleString()}
              </span>
            </div>
            {payment.metadata?.vehicleName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{payment.metadata.vehicleName}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-gray-600">Amount Paid</p>
            <p className="text-3xl font-bold">₦{formatCurrency(payment.amount)}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${payment.status === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {payment.status}
            </span>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>If you have any questions, please contact our support team</p>
            <p>support@anythingcars.com | +234 (0) 123 456 7890</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}