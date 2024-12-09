import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, MapPin, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const bookingSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().min(1, 'Drop-off location is required'),
  securityEscort: z.boolean(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  vehicle: {
    _id: string;
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    images: string[];
  };
}

export function BookingForm({ vehicle }: BookingFormProps) {
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const securityEscort = watch('securityEscort');

  const calculateTotal = (data: BookingFormData) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const baseAmount = days * vehicle.pricePerDay;
    const escortAmount = data.securityEscort ? days * 30000 : 0; // ₦30,000 per day for security escort
    return baseAmount + escortAmount;
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      const amount = calculateTotal(data);
      setTotalAmount(amount);
      setShowPayment(true);
    } catch (err) {
      setError('Failed to process booking. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await axios.post('/api/bookings', {
        vehicleId: vehicle._id,
        ...watch(),
        totalAmount,
      });
      // Redirect to bookings page or show success message
    } catch (err) {
      setError('Failed to complete booking. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div className="mt-1 relative">
              <input
                type="datetime-local"
                {...register('startDate')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div className="mt-1 relative">
              <input
                type="datetime-local"
                {...register('endDate')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={startDate}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              {...register('pickupLocation')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter pickup address"
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          {errors.pickupLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Drop-off Location
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              {...register('dropoffLocation')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter drop-off address"
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          {errors.dropoffLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.dropoffLocation.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('securityEscort')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Add Security Escort (₦30,000 per day)
          </label>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span>₦{calculateTotal(watch()).toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Includes driver and {securityEscort ? 'security escort' : 'no security escort'}
          </p>
        </div>

        <Button type="submit" className="w-full">
          Proceed to Payment
        </Button>
      </form>

      {showPayment && (
        <PaymentModal
          amount={totalAmount}
          email={user?.email || ''}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}