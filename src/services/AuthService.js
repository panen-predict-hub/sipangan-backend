import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import AuthenticationError from '../utils/exceptions/AuthenticationError.js';
import NotFoundError from '../utils/exceptions/NotFoundError.js';

class AuthService {
  constructor(userService) {
    this._userService = userService;
  }

  async verifyUserCredential(username, password) {
    try {
      const user = await this._userService.getUserByUsername(username);
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new AuthenticationError('Kredensial yang Anda berikan tidak valid');
      }

      return { id: user.id, username: user.username, role: user.role };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new AuthenticationError('Kredensial yang Anda berikan tidak valid');
      }
      throw error;
    }
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); // 15 menit
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
  }

  async addRefreshToken(token) {
    await query('INSERT INTO authenticators VALUES (?)', [token]);
  }

  async verifyRefreshToken(token) {
    const result = await query('SELECT token FROM authenticators WHERE token = ?', [token]);
    if (!result.rows.length) {
      throw new Error('Refresh token tidak valid');
    }

    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new Error('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await query('DELETE FROM authenticators WHERE token = ?', [token]);
  }
}

export default AuthService;
