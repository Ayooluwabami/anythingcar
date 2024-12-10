import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface UserDocument extends Document {
  id: string;
  email: string;
  username: string;
  password: string;
  accountType: 'Service Provider' | 'Customer';
  role: 'admin' | 'driver-owner' | 'security-escort' | 'car-dealer' | 'parts-dealer';
  phoneNumber: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  googleId?: string;
  serviceProviderInfo?: {
    companyName?: string;
    address?: string;
    registrationNumber?: string;
    serviceType?: 'Car Hire' | 'Security Service' | 'Car Dealership' | 'Parts Store';
    securityCredentials?: {
      organization?: string;
      badgeNumber?: string;
      firearmsLicense?: string;
    };
    vehicleFleet?: mongoose.Types.ObjectId[];
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments: {
    type: string[];
    url: string;
    verified: boolean;
    verifiedAt?: Date;
  }[];
  wallet: {
    balance: number;
    currency: string;
    transactions: mongoose.Types.ObjectId[];
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  ratings: {
    average: number;
    count: number;
    reviews: mongoose.Types.ObjectId[];
  };
  availability: {
    isAvailable: boolean;
    schedule: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      startTime: string;
      endTime: string;
    }[];
  };
  createdAt: Date;
  lastLoginAt?: Date;
  status: 'active' | 'suspended' | 'deactivated';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
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
    enum: ['Service Provider', 'Customer'],
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'driver-owner', 'security-escort', 'car-dealer', 'parts-dealer'],
    default: 'customer',
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
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  googleId: String,
  serviceProviderInfo: {
    type: new mongoose.Schema({
      companyName: String,
      address: String,
      registrationNumber: String, // CAC registration number
      serviceType: {
        type: String,
        enum: ['Car Hire', 'Security Service', 'Car Dealership', 'Parts Store'],
      },
      securityCredentials: {
        organization: String, // e.g., Nigerian Police, Armed Forces, NSCDC
        badgeNumber: String,
        firearmsLicense: String,
      },
      vehicleFleet: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
      }],
    }),
    required: false,
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocuments: [{
    type: {
      type: Array,
      enum: [
        'national_id',
        'business_registration',
        'drivers_license',
        'security_clearance',
        'firearms_license',
        'employment_verification'
      ],
    },
    url: String,
    verified: Boolean,
    verifiedAt: Date,
  }],
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'NGN'
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }]
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: Date,
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active'
  }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);

};

UserSchema.pre('validate', function (next) {
  if (!this.username && this.email) {
    this.username = (this.email as string).split('@')[0].toLowerCase();
  }
  next();
});

export const User = mongoose.model<UserDocument>('User', UserSchema);
