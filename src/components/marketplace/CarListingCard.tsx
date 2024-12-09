import { Car, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CarListingCardProps {
  listing: {
    _id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    condition: string;
    images: string[];
    location: {
      address: string;
    };
  };
  onViewDetails: (id: string) => void;
}

export function CarListingCard({ listing, onViewDetails }: CarListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={listing.images[0]}
          alt={`${listing.make} ${listing.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-blue-600 text-white text-sm rounded-full">
            {listing.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {listing.make} {listing.model} {listing.year}
        </h3>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{listing.location.address}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">{listing.mileage.toLocaleString()} km</span>
          </div>
          
          <div className="flex items-center text-xl font-bold text-blue-600">
            <DollarSign className="h-5 w-5" />
            <span>₦{formatCurrency(listing.price)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={() => onViewDetails(listing._id)}
            className="w-full"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}