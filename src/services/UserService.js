import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class UserService {
  constructor() {
    this._pool = pool;
  }

  async addUser({ username, password, fullname }) {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO users (id, username, password, fullname) VALUES (?, ?, ?, ?)';
    await this._pool.execute(query, [id, username, hashedPassword, fullname]);
    
    return id;
  }

  async getUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await this._pool.execute(query, [username]);
    
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    
    return rows[0];
  }
}

export default UserService;
