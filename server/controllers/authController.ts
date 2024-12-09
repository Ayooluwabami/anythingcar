import { Request, Response } from 'express';
import { authService } from '../services/authService';
import jwt from 'jsonwebtoken';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
      await authService.verifyEmail(req.body.token);
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  oauthCallback: async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      // Check if profile is complete
      const needsProfileCompletion = !user.phoneNumber;
      const redirectUrl = needsProfileCompletion
        ? `/complete-profile?token=${token}`
        : `/dashboard?token=${token}`;

      res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  },

  completeProfile: async (req: Request, res: Response) => {
    try {
      const result = await authService.completeProfile(req.user as any, req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};