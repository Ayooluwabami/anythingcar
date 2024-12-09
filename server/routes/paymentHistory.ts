import express from 'express';
import { auth } from '../middleware/auth';
import { Payment } from '../models/Payment';

const router = express.Router();

router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments({ userId: req.user._id });

    res.json({
      payments,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;