import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  generateSecureToken,
  hashToken,
  validatePassword,
  validateEmail
} from '../utils/auth';
import { authenticateToken } from '../middleware/auth';
import { loginLimiter, signupLimiter, passwordResetLimiter } from '../middleware/rateLimit';

const router = express.Router();
const prisma = new PrismaClient();

// Cookie options for production security
const getCookieOptions = () => ({
  httpOnly: true, // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax' as const, // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
});

/**
 * POST /api/auth/signup
 * Register a new user account
 */
router.post('/signup', signupLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      // Generic message to prevent email enumeration
      res.status(400).json({ error: 'Unable to create account. Please try a different email.' });
      return;
    }

    // Hash password with bcrypt (14 rounds)
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const { token: verificationToken, hashedToken } = generateSecureToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        isEmailVerified: false,
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: verificationExpiry
      },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    // Generate JWT
    const token = generateJWT({ userId: user.id, email: user.email });

    // Set HTTP-only cookie
    res.cookie('authToken', token, getCookieOptions());

    // In production, send verification email here
    // For now, return the token for testing purposes
    console.log(`Email verification token for ${email}: ${verificationToken}`);
    console.log(`Verification link: ${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`);

    res.status(201).json({
      message: 'Account created successfully',
      user,
      // Remove this in production - only for development testing
      ...(process.env.NODE_ENV === 'development' && { verificationToken })
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Generic error message to prevent user enumeration
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT
    const token = generateJWT({ userId: user.id, email: user.email });

    // Set HTTP-only cookie
    res.cookie('authToken', token, getCookieOptions());

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

/**
 * POST /api/auth/logout
 * Clear authentication session
 */
router.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('authToken', getCookieOptions());
  res.json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset token
 */
router.post('/forgot-password', passwordResetLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Always return success to prevent user enumeration
    // Even if user doesn't exist, we pretend we sent an email
    if (!user) {
      res.json({
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
      return;
    }

    // Generate reset token (1 hour expiry)
    const { token: resetToken, hashedToken } = generateSecureToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save hashed token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: resetExpiry
      }
    });

    // In production, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Remove this in production - only for development testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: 'Token and new password are required' });
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
      return;
    }

    // Hash the provided token
    const hashedToken = hashToken(token);

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and clear reset token (one-time use)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null
      }
    });

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email address using token
 */
router.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'Verification token is required' });
      return;
    }

    // Hash the provided token
    const hashedToken = hashToken(token);

    // Find user with valid verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired verification token' });
      return;
    }

    // Mark email as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null
      }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * POST /api/auth/resend-verification
 * Resend email verification token
 */
router.post('/resend-verification', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ error: 'Email already verified' });
      return;
    }

    // Generate new verification token
    const { token: verificationToken, hashedToken } = generateSecureToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: verificationExpiry
      }
    });

    // In production, send email here
    console.log(`New verification token for ${user.email}: ${verificationToken}`);

    res.json({
      message: 'Verification email sent',
      ...(process.env.NODE_ENV === 'development' && { verificationToken })
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
