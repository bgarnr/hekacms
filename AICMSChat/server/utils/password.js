const argon2 = require('argon2');

// Argon2 parameters (best-practice for web auth)
const ARGON_OPTS = {
  type: argon2.argon2id,
  timeCost: 3,           // iterations
  memoryCost: 2 ** 16,   // 64 MB
  parallelism: 1,
};

/**
 * Hashes the password using Argon2id.
 * @param {string} password Plain-text password
 * @returns {Promise<string>} Argon2 hash
 */
const generatePasswordHash = async (password) => {
  return argon2.hash(password, ARGON_OPTS);
};

/**
 * Validates password against an Argon2 hash.
 * @param {string} password Plain-text password
 * @param {string} hash Stored hash
 * @returns {Promise<boolean>} Match result
 */
const validatePassword = async (password, hash) => {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
};

/**
 * Simple check that supplied string resembles an Argon2 hash.
 */
const isPasswordHash = (hash) => {
  return typeof hash === 'string' && hash.startsWith('$argon2');
};

module.exports = {
  generatePasswordHash,
  validatePassword,
  isPasswordHash,
};
