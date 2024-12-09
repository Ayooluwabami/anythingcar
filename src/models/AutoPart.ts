import mongoose from 'mongoose';

const autoPartSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  partNumber: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: [
      'Engine Parts',
      'Transmission',
      'Brakes',
      'Suspension',
      'Electrical',
      'Body Parts',
      'Interior',
      'Wheels & Tires',
      'Other'
    ],
    required: true,
  },
  condition: {
    type: String,
    enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
    required: true,
  },
  compatibility: [{
    make: String,
    model: String,
    yearStart: Number,
    yearEnd: Number,
  }],
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  specifications: {
    type: Map,
    of: String,
  },
  warranty: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AutoPart = mongoose.model('AutoPart', autoPartSchema);