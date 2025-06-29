const { generatePasswordHash, validatePassword, isPasswordHash } = require('./password');

describe('Password Utilities', () => {
  const testPassword = 'TestPassword123!';
  const weakPassword = '123';
  const strongPassword = 'MyVerySecurePassword2024!@#';

  describe('generatePasswordHash', () => {
    test('should generate a hash for a valid password', async () => {
      const hash = await generatePasswordHash(testPassword);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(50); // Argon2 hashes are long
      expect(hash.startsWith('$argon2')).toBe(true);
    });

    test('should generate different hashes for the same password', async () => {
      const hash1 = await generatePasswordHash(testPassword);
      const hash2 = await generatePasswordHash(testPassword);
      
      expect(hash1).not.toBe(hash2); // Salt should make them different
      expect(hash1.startsWith('$argon2')).toBe(true);
      expect(hash2.startsWith('$argon2')).toBe(true);
    });

    test('should handle empty password', async () => {
      const hash = await generatePasswordHash('');
      expect(hash).toBeDefined();
      expect(hash.startsWith('$argon2')).toBe(true);
    });

    test('should handle special characters', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = await generatePasswordHash(specialPassword);
      
      expect(hash).toBeDefined();
      expect(hash.startsWith('$argon2')).toBe(true);
    });
  });

  describe('validatePassword', () => {
    test('should validate correct password', async () => {
      const hash = await generatePasswordHash(testPassword);
      const isValid = await validatePassword(testPassword, hash);
      
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const hash = await generatePasswordHash(testPassword);
      const isValid = await validatePassword('WrongPassword', hash);
      
      expect(isValid).toBe(false);
    });

    test('should reject empty password against valid hash', async () => {
      const hash = await generatePasswordHash(testPassword);
      const isValid = await validatePassword('', hash);
      
      expect(isValid).toBe(false);
    });

    test('should handle invalid hash gracefully', async () => {
      const isValid = await validatePassword(testPassword, 'invalid-hash');
      expect(isValid).toBe(false);
    });

    test('should handle empty hash gracefully', async () => {
      const isValid = await validatePassword(testPassword, '');
      expect(isValid).toBe(false);
    });

    test('should validate weak password if hash matches', async () => {
      const hash = await generatePasswordHash(weakPassword);
      const isValid = await validatePassword(weakPassword, hash);
      
      expect(isValid).toBe(true);
    });

    test('should validate strong password', async () => {
      const hash = await generatePasswordHash(strongPassword);
      const isValid = await validatePassword(strongPassword, hash);
      
      expect(isValid).toBe(true);
    });
  });

  describe('isPasswordHash', () => {
    test('should identify valid argon2 hash', async () => {
      const hash = await generatePasswordHash(testPassword);
      expect(isPasswordHash(hash)).toBe(true);
    });

    test('should reject non-argon2 strings', () => {
      expect(isPasswordHash('plaintext')).toBe(false);
      expect(isPasswordHash('$2b$10$someotherhash')).toBe(false); // bcrypt
      expect(isPasswordHash('sha256hash')).toBe(false);
    });

    test('should reject empty or null values', () => {
      expect(isPasswordHash('')).toBe(false);
      expect(isPasswordHash(null)).toBe(false);
      expect(isPasswordHash(undefined)).toBe(false);
    });

    test('should reject non-string types', () => {
      expect(isPasswordHash(123)).toBe(false);
      expect(isPasswordHash({})).toBe(false);
      expect(isPasswordHash([])).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('should handle complete hash-verify cycle', async () => {
      const passwords = [
        'simple',
        'Complex123!',
        '🔐🚀💻', // Unicode
        'a'.repeat(100), // Long password
      ];

      for (const password of passwords) {
        const hash = await generatePasswordHash(password);
        
        expect(isPasswordHash(hash)).toBe(true);
        expect(await validatePassword(password, hash)).toBe(true);
        expect(await validatePassword(password + 'wrong', hash)).toBe(false);
      }
    });

    test('should be consistent across multiple runs', async () => {
      const password = 'ConsistencyTest123!';
      
      for (let i = 0; i < 5; i++) {
        const hash = await generatePasswordHash(password);
        expect(await validatePassword(password, hash)).toBe(true);
        expect(await validatePassword('wrong', hash)).toBe(false);
      }
    });
  });
}); 