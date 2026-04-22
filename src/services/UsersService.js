import { pool } from '../config/database.js';
import InvariantError from '../utils/exceptions/InvariantError.js';

class UsersService {
  constructor() {
    this._pool = pool;
  }

  async addUser({ name, email, password }) {
    // Check for duplicate email
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkResult = await this._pool.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      throw new InvariantError('Email sudah terdaftar');
    }

    // NOTE: In production, hash the password with bcrypt before storing
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const result = await this._pool.query(query, [name, email, password]);
    return result.rows[0].id;
  }
}

export default UsersService;
