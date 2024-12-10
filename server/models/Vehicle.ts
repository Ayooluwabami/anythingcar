import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 2007,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
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
  pricePerDay: {
    type: Number,
    required: true,
  },
  pricePerTrip: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  features: [String],
  driverProvided: {
    type: Boolean,
    default: false,
  },
  driverDetails: {
    name: String,
    licenseNumber: String,
    phoneNumber: String,
    driverId: String,
  },
});

vehicleSchema.index({ location: '2dsphere' });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);