import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class CommoditiesService {
  constructor() {
    this._pool = pool;
  }

  async getCommodities() {
    const [rows] = await this._pool.query('SELECT * FROM commodities');
    return rows;
  }

  async addCommodity({ name, unit }) {
    const id = uuidv4();
    const query = 'INSERT INTO commodities (id, name, unit) VALUES (?, ?, ?)';
    await this._pool.execute(query, [id, name, unit]);
    return id;
  }

  async updateCommodity(id, { name, unit }) {
    const query = 'UPDATE commodities SET name = ?, unit = ? WHERE id = ?';
    const [result] = await this._pool.execute(query, [name, unit, id]);
    if (result.affectedRows === 0) {
      throw new Error('Commodity not found');
    }
  }

  async deleteCommodity(id) {
    const query = 'DELETE FROM commodities WHERE id = ?';
    const [result] = await this._pool.execute(query, [id]);
    if (result.affectedRows === 0) {
      throw new Error('Commodity not found');
    }
  }
}

export default CommoditiesService;
