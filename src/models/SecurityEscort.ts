import mongoose from 'mongoose';

const securityEscortSchema = new mongoose.Schema({
  escort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  organization: {
    type: String,
    required: true,
    enum: ['Nigerian Police', 'Armed Forces', 'NSCDC'],
  },
  credentials: {
    badgeNumber: {
      type: String,
      required: true,
    },
    firearmsLicense: {
      type: String,
      required: true,
    },
    expiryDate: Date,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  dailyRate: {
    type: Number,
    default: 30000, // ₦30,000 per day
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

securityEscortSchema.index({ location: '2dsphere' });

export const SecurityEscort = mongoose.model('SecurityEscort', securityEscortSchema);