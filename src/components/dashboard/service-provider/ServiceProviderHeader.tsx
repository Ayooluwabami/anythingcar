import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function ServiceProviderHeader() {
  const { user } = useAuth();

  const getRoleDisplay = (role: string) => {
    const roles = {
      'driver-owner': 'Driver Owner',
      'security-escort': 'Security Escort',
      'car-dealer': 'Car Dealer',
      'parts-dealer': 'Parts Dealer'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-gray-600">{getRoleDisplay(user?.role || '')}</p>
        </div>
      </div>
      {user?.serviceProviderInfo?.companyName && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">Company</p>
          <p className="font-medium">{user.serviceProviderInfo.companyName}</p>
        </div>
      )}
    </div>
  );
}