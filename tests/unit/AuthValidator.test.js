import { describe, it, expect } from '@jest/globals';
import AuthValidator from '../../src/validator/auth/index.js';

describe('AuthValidator', () => {
  it('should not throw error when given valid login payload', () => {
    const payload = {
      username: 'testuser',
      password: 'password123',
    };

    expect(() => AuthValidator.validateLoginPayload(payload)).not.toThrow();
  });

  it('should throw error when username is missing', () => {
    const payload = {
      password: 'password123',
    };

    expect(() => AuthValidator.validateLoginPayload(payload)).toThrow();
  });

  it('should throw error when extra fields are present (unknown fields)', () => {
    const payload = {
      username: 'testuser',
      password: 'password123',
      extra: 'not allowed',
    };

    expect(() => AuthValidator.validateLoginPayload(payload)).toThrow();
  });
});
