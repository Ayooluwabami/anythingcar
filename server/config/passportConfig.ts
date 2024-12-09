import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User';

export const configurePassport = () => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.FRONTEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          
          if (!user) {
            user = await User.create({
              email: profile.emails![0].value,
              googleId: profile.id,
              username: profile.emails![0].value.split('@')[0],
              isVerified: true,
              phoneNumber: '', // Will need to be updated by user
              role: 'customer', // Default role
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Microsoft Strategy
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID!,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
        callbackURL: `${process.env.FRONTEND_URL}/api/auth/microsoft/callback`,
        scope: ['user.read'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ microsoftId: profile.id });
          
          if (!user) {
            user = await User.create({
              email: profile.emails![0].value,
              microsoftId: profile.id,
              username: profile.emails![0].value.split('@')[0],
              isVerified: true,
              phoneNumber: '', // Will need to be updated by user
              role: 'customer', // Default role
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID!,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        callbackURL: `${process.env.FRONTEND_URL}/api/auth/facebook/callback`,
        profileFields: ['id', 'emails', 'name'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ facebookId: profile.id });
          
          if (!user) {
            user = await User.create({
              email: profile.emails![0].value,
              facebookId: profile.id,
              username: profile.emails![0].value.split('@')[0],
              isVerified: true,
              phoneNumber: '', // Will need to be updated by user
              role: 'customer', // Default role
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
};