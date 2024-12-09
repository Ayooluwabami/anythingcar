import { DollarSign, Calendar, Star, Clock } from 'lucide-react';

interface ServiceProviderStatsProps {
  stats: {
    earnings: number;
    bookings: number;
    rating: number;
    completionRate: number;
  };
}

export function ServiceProviderStats({ stats }: ServiceProviderStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-xl font-bold mt-1">₦{stats.earnings.toLocaleString()}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-xl font-bold mt-1">{stats.bookings}</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-xl font-bold mt-1">{stats.rating.toFixed(1)}</p>
          </div>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xl font-bold mt-1">{stats.completionRate}%</p>
          </div>
          <Clock className="h-8 w-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
}