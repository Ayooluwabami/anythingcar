import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { User } from '../models/User';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const notificationService = {
  async sendOTP(user: any, otpType: 'email' | 'phone') {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, {
      verificationOTP: otp,
      otpExpiresAt: expiresAt,
    });

    if (otpType === 'email') {
      await sgMail.send({
        to: user.email,
        from: process.env.SMTP_USER!,
        subject: 'Verify your Anything Cars account',
        text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
        html: `
          <h1>Welcome to Anything Cars!</h1>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        `,
      });
    } else {
      await twilioClient.messages.create({
        body: `Your Anything Cars verification code is: ${otp}. This code will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phoneNumber,
      });
    }

    return { message: `OTP sent successfully to your ${otpType}` };
  },

  async verifyOTP(userId: string, otp: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.verificationOTP !== otp) {
      throw new Error('Invalid OTP');
    }

    if (user.otpExpiresAt < new Date()) {
      throw new Error('OTP has expired');
    }

    await User.findByIdAndUpdate(userId, {
      isVerified: true,
      verificationOTP: null,
      otpExpiresAt: null,
    });

    return { message: 'Account verified successfully' };
  },

  async sendNotification(user: any, subject: string, message: string) {
    if (user.preferredNotification === 'email') {
      await sgMail.send({
        to: user.email,
        from: process.env.SMTP_USER!,
        subject,
        text: message,
        html: `<div>${message}</div>`,
      });
    } else {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phoneNumber,
      });
    }
  },
};