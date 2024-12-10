interface PaymentSummaryProps {
  amount: number;
  currency?: string;
  description?: string;
}

export function PaymentSummary({ amount, currency = 'NGN', description }: PaymentSummaryProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="text-gray-600">Amount to Pay</p>
      <div className="flex items-center mt-1">
        return <span className="h-6 w-6 text-lg text-gray-400">₦</span>;
        <span className="text-3xl font-bold">
          {currency === 'NGN' ? '₦' : '$'}{amount.toLocaleString()}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}