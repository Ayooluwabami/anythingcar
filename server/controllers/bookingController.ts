import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';
import { notificationService } from '../services/notificationService';

export const bookingController = {
  async createBooking(req: Request, res: Response) {
    try {
      const { vehicleId, startDate, endDate, pickupLocation, dropoffLocation } = req.body;
      const userId = req.user._id;

      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      if (!vehicle.isAvailable) {
        return res.status(400).json({ error: 'Vehicle is not available for booking' });
      }

      // Calculate booking duration and total amount
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = days * vehicle.pricePerDay;

      const booking = new Booking({
        customer: userId,
        vehicle: vehicleId,
        driver: vehicle.driverDetails,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalAmount,
      });

      await booking.save();

      // Update vehicle availability
      vehicle.isAvailable = false;
      await vehicle.save();

      // Send notifications
      const customer = await User.findById(userId);
      await notificationService.sendBookingConfirmation(customer, booking);

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getUserBookings(req: Request, res: Response) {
    try {
      const bookings = await Booking.find({ customer: req.user._id })
        .populate('vehicle')
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getBookingDetails(req: Request, res: Response) {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        customer: req.user._id,
      }).populate('vehicle');

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async cancelBooking(req: Request, res: Response) {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        customer: req.user._id,
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status === 'Completed') {
        return res.status(400).json({ error: 'Cannot cancel completed booking' });
      }

      // Calculate cancellation fee (10% of total amount)
      const cancellationFee = booking.totalAmount * 0.1;

      booking.status = 'Cancelled';
      booking.cancellationFee = cancellationFee;
      await booking.save();

      // Update vehicle availability
      await Vehicle.findByIdAndUpdate(booking.vehicle, { isAvailable: true });

      // Send cancellation notifications
      const customer = await User.findById(req.user._id);
      await notificationService.sendBookingCancellation(customer, booking);

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async completeBooking(req: Request, res: Response) {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        customer: req.user._id,
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'InProgress') {
        return res.status(400).json({ error: 'Booking is not in progress' });
      }

      booking.status = 'Completed';
      await booking.save();

      // Update vehicle availability
      await Vehicle.findByIdAndUpdate(booking.vehicle, { isAvailable: true });

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async addReview(req: Request, res: Response) {
    try {
      const { rating, review } = req.body;
      const booking = await Booking.findOne({
        _id: req.params.id,
        customer: req.user._id,
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'Completed') {
        return res.status(400).json({ error: 'Can only review completed bookings' });
      }

      booking.rating = rating;
      booking.review = review;
      await booking.save();

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};