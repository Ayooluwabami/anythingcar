import { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  pricePerTrip: number;
  images: string[];
  features: string[];
  location: {
    coordinates: [number, number];
  };
  driverProvided: boolean;
}

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    driverProvided: 'all',
    sortBy: 'price',
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles', { params: filters });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <option value="all">All Prices</option>
            <option value="0-50">Under ₦50,000</option>
            <option value="50-100">₦50,000 - ₦100,000</option>
            <option value="100+">Above ₦100,000</option>
          </select>

          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.driverProvided}
            onChange={(e) => setFilters({ ...filters, driverProvided: e.target.value })}
          >
            <option value="all">All Types</option>
            <option value="true">With Driver</option>
            <option value="false">Self Drive</option>
          </select>

          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="year">Year: Newest First</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Lagos, Nigeria</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Daily Rate</span>
                  </div>
                  <div className="flex items-center text-lg font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>₦{vehicle.pricePerDay.toLocaleString()}</span>
                  </div>
                </div>
                <Button>Book Now</Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {vehicle.driverProvided && (
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                      Driver Included
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}