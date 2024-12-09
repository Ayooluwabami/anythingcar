import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';
import { SecurityEscort } from '../models/SecurityEscort';
import { notificationService } from './notificationService';

export const bookingService = {
  async createBooking(userId: string, bookingData: any) {
    const vehicle = await Vehicle.findById(bookingData.vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (!vehicle.isAvailable) {
      throw new Error('Vehicle is not available for booking');
    }

    // Calculate total amount
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const baseAmount = days * vehicle.pricePerDay;
    const securityEscortAmount = bookingData.securityEscort ? days * 30000 : 0;
    const totalAmount = baseAmount + securityEscortAmount;

    // Create booking
    const booking = new Booking({
      customer: userId,
      vehicle: vehicle._id,
      driver: vehicle.driver,
      startDate,
      endDate,
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      totalAmount,
      securityEscortAmount,
      paymentMethod: bookingData.paymentMethod,
    });

    // If security escort is requested, create security escort record
    if (bookingData.securityEscort) {
      const securityEscort = await SecurityEscort.create({
        booking: booking._id,
        startDate,
        endDate,
        totalAmount: securityEscortAmount,
      });
      booking.securityEscort = securityEscort._id;
    }

    await booking.save();

    // Update vehicle availability
    vehicle.isAvailable = false;
    await vehicle.save();

    // Send notifications
    const customer = await User.findById(userId);
    const driver = await User.findById(vehicle.driver);

    if (customer) {
      await notificationService.sendNotification(
        customer,
        'Booking Confirmation',
        `Your booking for ${vehicle.make} ${vehicle.model} has been confirmed.`
      );
    }

    if (driver) {
      await notificationService.sendNotification(
        driver,
        'New Booking',
        `You have a new booking for ${vehicle.make} ${vehicle.model}.`
      );
    }

    return booking;
  },

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.customer.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (booking.status === 'Completed') {
      throw new Error('Cannot cancel completed booking');
    }

    // Calculate cancellation fee (10% of total amount)
    const cancellationFee = booking.totalAmount * 0.1;

    booking.status = 'Cancelled';
    booking.cancellationFee = cancellationFee;
    await booking.save();

    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(booking.vehicle, { isAvailable: true });

    return booking;
  },

  async getUserBookings(userId: string) {
    return Booking.find({ customer: userId })
      .populate('vehicle')
      .populate('driver')
      .populate('securityEscort')
      .sort({ createdAt: -1 });
  },

  async getBookingDetails(bookingId: string, userId: string) {
    const booking = await Booking.findById(bookingId)
      .populate('vehicle')
      .populate('driver')
      .populate('securityEscort');

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.customer.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    return booking;
  },
};