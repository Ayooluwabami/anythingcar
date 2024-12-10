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

  forgotPassword: async (email: string) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('User with this email does not exist');
    }
    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    user.passwordResetToken = resetToken;
    await user.save();

    // Send the reset token to the user's email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    const emailSubject = "Password Reset Request";
    const emailBody = `You requested a password reset. Click the link below to reset your password: \n\n${resetUrl}`;

    await sendEmail(user.email, emailSubject, emailBody);

    return { message: 'Password reset instructions have been sent to your email' };
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };

      const user = await User.findById(decoded._id);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate the new password 
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password is too weak');
      }

      user.password = newPassword;
      user.passwordResetToken = undefined; // Clear the reset token
      await user.save();

      return { message: 'Password has been successfully updated' };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};