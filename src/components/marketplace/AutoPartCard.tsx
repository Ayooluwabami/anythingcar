import { Wrench, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatCurrency';

interface AutoPartCardProps {
  part: {
    _id: string;
    name: string;
    category: string;
    condition: string;
    price: number;
    quantity: number;
    images: string[];
  };
  onViewDetails: (id: string) => void;
}

export function AutoPartCard({ part, onViewDetails }: AutoPartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={part.images[0]}
          alt={part.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded-full">
            {part.condition}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">
          {part.name}
        </h3>

        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <Wrench className="h-4 w-4 mr-2" />
            <span className="text-sm">{part.category}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {part.quantity} {part.quantity === 1 ? 'unit' : 'units'} available
            </span>
          </div>

          <div className="flex items-center text-xl font-bold text-blue-600">
            <DollarSign className="h-5 w-5" />
            <span>₦{formatCurrency(part.price)}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => onViewDetails(part._id)}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}