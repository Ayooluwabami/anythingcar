import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendEmail } from '../utils/email';
import { notificationService } from './notificationService';

export const authService = {
  register: async (userData: any) => {
    const { email, password, phoneNumber, role, notificationPreference } = userData;

    if (!email || !password || !phoneNumber) {
      throw new Error('All fields are required');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
      phoneNumber,
      role: role || 'customer',
      notificationPreference: notificationPreference || 'email',
    });

    await user.save();

    // Send verification based on preference
    if (notificationPreference === 'email') {
      await notificationService.sendOTP(user, 'email');
    } else {
      await notificationService.sendOTP(user, 'phone');
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return { user, token };
  },

  completeProfile: async (user: any, profileData: any) => {
    const { phoneNumber, role, notificationPreference } = profileData;

    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        phoneNumber,
        role: role || 'customer',
        notificationPreference: notificationPreference || 'email',
        isProfileComplete: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    // Send verification based on preference
    if (notificationPreference === 'email') {
      await notificationService.sendOTP(updatedUser, 'email');
    } else {
      await notificationService.sendOTP(updatedUser, 'phone');
    }

    return { user: updatedUser };
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return { user, token };
  },

  verifyEmail: async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
      await User.findByIdAndUpdate(decoded._id, { isVerified: true });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  verifyOTP: async (userId: string, otp: string) => {
    return notificationService.verifyOTP(userId, otp);
  },
};