import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
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
  passwordResetToken: {
    type: String,
    default: null,
  },
});

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  accountType: 'Business Owner' | 'Customer';
  role: 'admin' | 'car owner' | 'car dealer' | 'parts dealer';
  phoneNumber: string;
  isVerified: boolean;
  googleId?: string;
  preferredNotification: 'email' | 'phone';
  verificationOTP?: string;
  otpExpiresAt?: Date;
  businessInfo?: {
    companyName: string;
    address: string;
    registrationNumber: string;
    businessType: 'Car Dealership' | 'Auto Parts Store' | 'Both';
  };
  passwordResetToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre<IUser>('save', function (next) {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0].toLowerCase();
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
