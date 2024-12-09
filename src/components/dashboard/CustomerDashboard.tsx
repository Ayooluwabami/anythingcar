import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Booking {
  _id: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    images: string[];
  };
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
}

export function CustomerDashboard({ activeTab, setActiveTab }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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
          <Calendar className="h-5 w-5" />
          <span>My Bookings</span>
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
        <button
          onClick={() => setActiveTab('history')}
          className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'history'
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          <Clock className="h-5 w-5" />
          <span>History</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
              >
                <img
                  src={booking.vehicle.images[0]}
                  alt={`${booking.vehicle.make} ${booking.vehicle.model}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>
                      {new Date(booking.startDate).toLocaleDateString()} -{' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p>Status: {booking.status}</p>
                  </div>
                  <p className="font-medium">₦{booking.totalPrice.toLocaleString()}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}