import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database.js';

class LogService {
  constructor() {
    this._pool = pool;
  }

  /**
   * Add a new activity log
   * @param {Object} logData 
   * @param {string} logData.userId - ID of the user performing the action
   * @param {string} logData.action - Action name (e.g., 'ADD_PRICE', 'DELETE_USER')
   * @param {string} [logData.targetId] - ID of the record being affected
   * @param {Object|string} [logData.details] - Additional details about the action
   */
  async addLog({ userId, action, targetId, details }) {
    const id = uuidv4();
    const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;
    
    const query = 'INSERT INTO activity_logs (id, user_id, action, target_id, details) VALUES (?, ?, ?, ?, ?)';
    await this._pool.execute(query, [id, userId, action, targetId || null, detailsString || null]);
    
    return id;
  }

  /**
   * Get logs based on role and hierarchy
   * @param {Object} params
   * @param {string} params.role - Role of the requester
   * @param {string} params.userId - ID of the requester
   */
  async getLogs({ role, userId, page = 1, limit = 50 }) {
    let query = `
      SELECT al.*, u.username, u.fullname, u.role as user_role 
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
    `;
    const params = [];

    if (role === 'super_admin') {
      // Super admin sees everything
    } else if (role === 'admin') {
      // Admin sees logs of users they created (operators)
      query += ' WHERE u.created_by = ?';
      params.push(userId);
    } else {
      // Operators or others can only see their own logs (or nothing, depending on policy)
      // Based on user request, only admin/super_admin see logs
      query += ' WHERE al.user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    
    // Use .query instead of .execute for better compatibility with LIMIT placeholders
    const [rows] = await this._pool.query(query, [...params, Number(limit), Number(offset)]);
    return rows;
  }
}

export default LogService;
