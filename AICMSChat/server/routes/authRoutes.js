const express = require('express');
const UserService = require('../services/userService.js');
const { requireUser } = require('./middleware/auth.js');
const User = require('../models/User.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const sendError = msg => res.status(400).json({ message: msg });
  const { email, password } = req.body;

  console.log(`Login attempt for email: ${email}`);

  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return sendError('Email and password are required');
  }

  try {
    const user = await UserService.authenticateWithPassword(email, password);

    if (user) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      console.log(`User ${email} logged in successfully with role: ${user.role}`);
      return res.json({
        ...user.toObject(),
        accessToken,
        refreshToken
      });
    } else {
      console.log(`Failed login attempt for email: ${email}`);
      return sendError('Email or password is incorrect');
    }
  } catch (error) {
    console.error(`Login error for ${email}: ${error.message}`);
    return sendError('Login failed');
  }
});

router.post('/register', async (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user });
  }

  const { email, password, role } = req.body;

  try {
    console.log(`Registration attempt for email: ${email} with role: ${role}`);

    if (!email || !password) {
      console.log('Registration failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserService.create({ email, password, role });
    console.log(`New user registered: ${email} with role: ${user.role}`);
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Registration error for ${email}: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
});

router.post('/logout', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.refreshToken = null;
      await user.save();
      console.log(`User ${email} logged out successfully`);
    }

    res.status(200).json({ message: 'User logged out successfully.' });
  } catch (error) {
    console.error(`Logout error for ${email}: ${error.message}`);
    res.status(500).json({ message: 'Logout failed' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user
    const user = await UserService.get(decoded.sub);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    console.log(`Token refreshed for user: ${user.email}`);

    // Return new tokens
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error(`Token refresh error: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

router.get('/me', requireUser, async (req, res) => {
  try {
    console.log(`Current user info requested for: ${req.user.email} with role: ${req.user.role}`);
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(`Get current user error: ${error.message}`);
    return res.status(500).json({ message: 'Failed to get user information' });
  }
});

module.exports = router;