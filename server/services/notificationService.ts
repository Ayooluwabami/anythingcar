import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { User } from '../models/user';

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

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
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

  // Method to notify the admin
  async notifyAdmin(subject: string, details: any) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL!;

      // Send an email notification to the admin
      await sgMail.send({
        to: adminEmail,
        from: process.env.SMTP_USER!,
        subject,
        text: JSON.stringify(details, null, 2), // Convert details to a JSON string for easy reading
        html: `<pre>${JSON.stringify(details, null, 2)}</pre>`,
      });

      await twilioClient.messages.create({
        body: `Admin Notification: ${subject} - Details: ${JSON.stringify(details)}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.ADMIN_PHONE_NUMBER!,
      });

      return { message: 'Admin notified successfully' };
    } catch (error) {
      console.error('Error notifying admin:', error);
      throw new Error('Failed to notify admin');
    }
  }
};
