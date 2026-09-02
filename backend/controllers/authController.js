import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import EmailOtp from '../models/EmailOtp.js';
import { sendOtpEmail } from '../services/emailService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { validateEmail, validatePassword, sanitizeString } from '../utils/validators.js';
import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const createAndSendOtp = async (email, purpose) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const codeHash = crypto.createHash('sha256').update(otp).digest('hex');
  await EmailOtp.deleteMany({ email, purpose });
  await EmailOtp.create({
    email,
    purpose,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  await sendOtpEmail(email, otp);
};

const verifyOtp = async (email, purpose, otp) => {
  const challenge = await EmailOtp.findOne({ email, purpose }).sort({ createdAt: -1 });
  if (!challenge || challenge.expiresAt < new Date()) return false;
  if (challenge.attempts >= 5) return false;
  challenge.attempts += 1;
  await challenge.save();
  const codeHash = crypto.createHash('sha256').update(otp).digest('hex');
  if (codeHash !== challenge.codeHash) return false;
  await EmailOtp.deleteOne({ _id: challenge._id });
  return true;
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate
    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required.', 400);
    }
    if (!validateEmail(email)) {
      return errorResponse(res, 'Please enter a valid email address.', 422);
    }
    if (!validatePassword(password)) {
      return errorResponse(res, 'Password must be at least 8 characters.', 422);
    }
    if (confirmPassword && password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match.', 422);
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    // Create the account before verification so the full registration details are retained.
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password,
      role: 'user',
      plan: 'free',
    });

    // Create free subscription
    await Subscription.create({
      user: user._id,
      plan: 'free',
      status: 'active',
    });

    await createAndSendOtp(sanitizedEmail, 'register');

    return successResponse(
      res,
      { email: sanitizedEmail, requiresOtp: true },
      'Verification code sent to your email.',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, error.message || 'Registration failed.', 500);
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been suspended. Please contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    await createAndSendOtp(user.email, 'login');

    return successResponse(res, { email: user.email, requiresOtp: true }, 'Verification code sent to your email.');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed. Please try again.', 500);
  }
};

// POST /api/auth/verify-otp
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail || !/^\d{6}$/.test(otp || '') || !['register', 'login'].includes(purpose)) {
      return errorResponse(res, 'Email, six-digit OTP, and valid purpose are required.', 400);
    }

    const valid = await verifyOtp(normalizedEmail, purpose, otp);
    if (!valid) return errorResponse(res, 'Invalid or expired verification code.', 401);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return errorResponse(res, 'Account not found.', 404);
    if (purpose === 'login') {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);
    return successResponse(res, { token, user }, 'Email verified successfully.');
  } catch (error) {
    console.error('OTP verification error:', error);
    return errorResponse(res, 'OTP verification failed.', 500);
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscription = await Subscription.findOne({ user: req.user._id });
    return successResponse(res, { user, subscription });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch profile.', 500);
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = sanitizeString(name);

    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 'Current password is required to set a new password.', 400);
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, 'Current password is incorrect.', 401);
      }
      if (!validatePassword(newPassword)) {
        return errorResponse(res, 'New password must be at least 8 characters.', 422);
      }
      user.password = newPassword;
    }

    await user.save();
    return successResponse(res, { user }, 'Profile updated successfully.');
  } catch (error) {
    return errorResponse(res, 'Failed to update profile.', 500);
  }
};
