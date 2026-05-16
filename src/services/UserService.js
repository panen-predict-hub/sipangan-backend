import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import InvariantError from '../utils/exceptions/InvariantError.js';
import NotFoundError from '../utils/exceptions/NotFoundError.js';

class UserService {
  constructor() {
    this._pool = pool;
  }

  async addUser({ username, password, fullname, role = 'operator', createdBy = null }) {
    // Check if username already exists
    const [existing] = await this._pool.execute('SELECT id FROM users WHERE username = ? AND deleted_at IS NULL', [username]);
    if (existing.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = 'INSERT INTO users (id, username, password, fullname, role, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    await this._pool.execute(query, [id, username, hashedPassword, fullname, role, createdBy]);
    
    return id;
  }

  async getUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ? AND deleted_at IS NULL';
    const [rows] = await this._pool.execute(query, [username]);
    
    if (rows.length === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }
    
    return rows[0];
  }

  async getUserById(id) {
    const query = 'SELECT id, username, fullname, role, created_by, created_at FROM users WHERE id = ? AND deleted_at IS NULL';
    const [rows] = await this._pool.execute(query, [id]);
    
    if (rows.length === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }
    
    return rows[0];
  }

  async getUsers(role, userId) {
    let query = 'SELECT id, username, fullname, role, created_by, created_at FROM users WHERE deleted_at IS NULL';
    const params = [];

    if (role === 'super_admin') {
      // Super admin can see all active
    } else if (role === 'admin') {
      // Admin sees active users they created (operators)
      query += ' AND created_by = ?';
      params.push(userId);
    } else {
      // Operator sees only themselves
      query += ' AND id = ?';
      params.push(userId);
    }

    const [rows] = await this._pool.execute(query, params);
    return rows;
  }

  async deleteUser(id, managerId, managerRole) {
    const user = await this.getUserById(id);

    // Protection: No one can delete a super_admin
    if (user.role === 'super_admin') {
      throw new Error('Administrator Utama tidak dapat dihapus');
    }

    // Hierarchy check: admin can only delete users they created (or operators)
    if (managerRole === 'admin' && user.created_by !== managerId) {
      throw new Error('Anda tidak memiliki akses untuk menghapus user ini');
    }

    const query = 'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    await this._pool.execute(query, [id]);
  }

  async updateUser(id, { fullname, password, role }, managerId, managerRole) {
    const user = await this.getUserById(id);

    // Hierarchy check
    if (managerRole === 'admin' && user.created_by !== managerId) {
      throw new Error('Anda tidak memiliki akses untuk mengubah user ini');
    }

    const updates = [];
    const params = [];

    if (fullname) {
      updates.push('fullname = ?');
      params.push(fullname);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (role) {
      // Admin can only set role to operator
      if (managerRole === 'admin' && role !== 'operator') {
        throw new Error('Administrator hanya bisa mengatur role ke Admin Biasa (Operator)');
      }
      updates.push('role = ?');
      params.push(role);
    }

    if (updates.length === 0) return;

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);

    await this._pool.execute(query, params);
  }

  async verifyUserHierarchy(managerId, managerRole, targetId) {
    const user = await this.getUserById(targetId);
    
    if (managerRole === 'super_admin') return true;
    
    if (managerRole === 'admin' && user.created_by === managerId) return true;

    throw new Error('Akses ditolak: Hirarki tidak sesuai');
  }
}

export default UserService;
