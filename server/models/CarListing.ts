import mongoose from 'mongoose';

const carListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  make: {
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
  },
  price: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ['New', 'Foreign-Used', 'Nigerian Used - Like New', 'Nigerian Used - Good', 'Nigerian Used - Fair'],
    required: true,
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    required: true,
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [String],
  images: [{
    type: String,
    required: true,
  }],
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
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Reserved'],
    default: 'Available',
  },
  negotiable: {
    type: Boolean,
    default: true,
  },
  inspectionAvailable: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

carListingSchema.index({ location: '2dsphere' });
carListingSchema.index({ make: 1, model: 1, year: -1 });
carListingSchema.index({ price: 1 });
carListingSchema.index({ condition: 1 });

// Update timestamp on save
carListingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CarListing = mongoose.model('CarListing', carListingSchema);