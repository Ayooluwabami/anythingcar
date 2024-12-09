import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  accountType: {
    type: String,
    enum: ['Business Owner', 'Customer'],
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'car owner', 'car dealer', 'parts dealer'],
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: String,
  microsoftId: String,
  facebookId: String,
  businessInfo: {
    companyName: String,
    address: String,
    registrationNumber: String,
    businessType: {
      type: String,
      enum: ['Car Dealership', 'Auto Parts Store', 'Both'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('validate', function (next) {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0].toLowerCase();
  }
  next();
});

export const User = mongoose.model('User', userSchema);