import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import AuthService from '../../src/services/AuthService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let authService, userService;

  beforeEach(() => {
    userService = {
      getUserByUsername: jest.fn(),
    };
    authService = new AuthService(userService);
    process.env.JWT_SECRET = 'secret';
    jest.clearAllMocks();
  });

  describe('verifyUserCredential', () => {
    it('should return user info if credentials are valid', async () => {
      const mockUser = { id: 'uuid', username: 'admin', password: 'hashed_password' };
      userService.getUserByUsername.mockResolvedValue(mockUser);
      
      // Use spyOn for ESM compatibility
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.verifyUserCredential('admin', 'password123');

      expect(result).toEqual({ id: 'uuid', username: 'admin' });
      expect(compareSpy).toHaveBeenCalled();
      compareSpy.mockRestore();
    });

    it('should throw error if password does not match', async () => {
      const mockUser = { id: 'uuid', username: 'admin', password: 'hashed_password' };
      userService.getUserByUsername.mockResolvedValue(mockUser);
      
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.verifyUserCredential('admin', 'wrong')).rejects.toThrow('Invalid credentials');
      compareSpy.mockRestore();
    });
  });

  describe('generateAccessToken', () => {
    it('should call jwt.sign with correct payload', () => {
      const payload = { id: 'uuid', username: 'admin' };
      const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue('mock_token');

      const token = authService.generateAccessToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'secret', { expiresIn: '1h' });
      expect(token).toBe('mock_token');
      signSpy.mockRestore();
    });
  });
});
