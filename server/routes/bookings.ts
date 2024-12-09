import express from 'express';
import { bookingController } from '../controllers/bookingController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingDetails);
router.post('/:id/cancel', auth, bookingController.cancelBooking);
router.post('/:id/complete', auth, bookingController.completeBooking);
router.post('/:id/review', auth, bookingController.addReview);

export default router;