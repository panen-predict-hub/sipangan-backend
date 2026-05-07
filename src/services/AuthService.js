import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class AuthService {
  constructor(userService) {
    this._userService = userService;
  }

  async verifyUserCredential(username, password) {
    const user = await this._userService.getUserByUsername(username);
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error('Invalid credentials');
    }

    return { id: user.id, username: user.username };
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

export default AuthService;
