import { CreditCard, Check } from 'lucide-react';

interface PaymentMethodCardProps {
  id: string;
  name: string;
  icon: 'card' | 'paystack' | 'flutterwave';
  selected: boolean;
  onSelect: (id: string) => void;
}

export function PaymentMethodCard({ id, name, icon, selected, onSelect }: PaymentMethodCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'paystack':
      case 'flutterwave':
        return <span className="h-6 w-6 text-lg">₦</span>;

    }
  };

  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full flex items-center justify-between p-4 rounded-lg border ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-blue-600">{getIcon()}</div>
        <span className="font-medium">{name}</span>
      </div>
      {selected && <Check className="h-5 w-5 text-blue-600" />}
    </button>
  );
}