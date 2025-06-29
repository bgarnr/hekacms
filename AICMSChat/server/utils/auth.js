const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  const payload = {
    sub: user._id,
    email: user.email,
    role: user.role
  };
  const secret = process.env.JWT_SECRET || 'DEV_JWT_SECRET_REPLACE_ME';
  return jwt.sign(payload, secret, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  const payload = {
    sub: user._id,
    email: user.email,
    role: user.role
  };
  const secret = process.env.REFRESH_TOKEN_SECRET || 'DEV_REFRESH_SECRET_REPLACE_ME';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};