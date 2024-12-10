import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { CarOwnerDashboard } from '@/components/dashboard/CarOwnerDashboard';

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-600">
          {user?.role === 'carOwner'
            ? 'Manage your vehicles and bookings'
            : 'View your bookings and trips'}
        </p>
      </div>

      {user?.role === 'carOwner' ? (
        <CarOwnerDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <CustomerDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}