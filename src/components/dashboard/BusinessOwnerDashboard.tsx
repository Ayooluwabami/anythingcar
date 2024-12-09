import { useState, useEffect } from 'react';
import { Car, Package, DollarSign, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface BusinessStats {
  totalRevenue: number;
  activeListings: number;
  totalBookings: number;
  customerCount: number;
}

export function BusinessOwnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BusinessStats>({
    totalRevenue: 0,
    activeListings: 0,
    totalBookings: 0,
    customerCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessStats();
  }, []);

  const fetchBusinessStats = async () => {
    try {
      const response = await axios.get('/api/business/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching business stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'car owner':
        return <CarOwnerSection stats={stats} />;
      case 'car dealer':
        return <CarDealerSection stats={stats} />;
      case 'parts dealer':
        return <PartsDealerSection stats={stats} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          trend="+12.5%"
        />
        <StatCard
          icon={<Car className="h-8 w-8 text-blue-600" />}
          title="Active Listings"
          value={stats.activeListings.toString()}
          trend="+5"
        />
        <StatCard
          icon={<Package className="h-8 w-8 text-purple-600" />}
          title="Total Bookings"
          value={stats.totalBookings.toString()}
          trend="+8"
        />
        <StatCard
          icon={<Users className="h-8 w-8 text-orange-600" />}
          title="Customers"
          value={stats.customerCount.toString()}
          trend="+3"
        />
      </div>

      {/* Role-specific dashboard */}
      {renderDashboardByRole()}
    </div>
  );
}

function StatCard({ icon, title, value, trend }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        {icon}
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-600 font-medium">{trend}</span>
        <span className="text-gray-600 ml-2">vs last month</span>
      </div>
    </div>
  );
}

function CarOwnerSection({ stats }: { stats: BusinessStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
        {/* Add recent bookings list */}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Vehicle Performance</h2>
        {/* Add vehicle performance metrics */}
      </div>
    </div>
  );
}

function CarDealerSection({ stats }: { stats: BusinessStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
        {/* Add recent sales list */}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Inventory Status</h2>
        {/* Add inventory status */}
      </div>
    </div>
  );
}

function PartsDealerSection({ stats }: { stats: BusinessStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Parts Sales</h2>
        {/* Add parts sales metrics */}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
        {/* Add low stock alerts */}
      </div>
    </div>
  );
}