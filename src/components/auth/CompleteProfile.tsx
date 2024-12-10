import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const profileSchema = z.object({
  phoneNumber: z.string()
    .min(11, 'Phone number must be at least 11 digits')
    .max(14, 'Phone number must not exceed 14 digits'),
  role: z.enum(['customer', 'carOwner']),
  notificationPreference: z.enum(['email', 'phone']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: 'customer',
      notificationPreference: 'email',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const token = searchParams.get('token');
      if (!token) throw new Error('No authentication token found');

      await axios.post('/api/auth/complete-profile', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete profile');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              {...register('phoneNumber')}
              type="tel"
              placeholder="+234"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="carOwner">Car Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Notification Method
            </label>
            <select
              {...register('notificationPreference')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone (SMS)</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Complete Profile
          </Button>
        </form>
      </div>
    </div>
  );
}