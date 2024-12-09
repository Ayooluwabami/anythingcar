import { useState, useEffect } from 'react';
import { Car, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  images: string[];
  isAvailable: boolean;
  pricePerDay: number;
  totalBookings: number;
}

export function CarOwnerDashboard({ activeTab, setActiveTab }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeBookings: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    fetchVehicles();
    fetchStats();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('/api/vehicles/owner');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/vehicles/owner/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          <Car className="h-5 w-5" />
          <span>My Vehicles</span>
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'bookings'
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Bookings</span>
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'earnings'
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          <DollarSign className="h-5 w-5" />
          <span>Earnings</span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'messages'
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="text-2xl font-bold">₦{stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
            <p className="text-2xl font-bold">{stats.activeBookings}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
              >
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>Daily Rate: ₦{vehicle.pricePerDay.toLocaleString()}</p>
                    <p>Total Bookings: {vehicle.totalBookings}</p>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vehicle.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}