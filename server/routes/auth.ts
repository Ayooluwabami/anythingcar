import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Local authentication routes
router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.oauthCallback
);

router.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'] })
);

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  authController.oauthCallback
);

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  authController.oauthCallback
);

// Profile completion for OAuth users
router.post('/complete-profile', authController.completeProfile);

export default router;