import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import NotFoundError from '../utils/exceptions/NotFoundError.js';
import InvariantError from '../utils/exceptions/InvariantError.js';


class CommoditiesService {
  constructor(logService) {
    this._pool = pool;
    this._logService = logService;
  }

  async getCommodities() {
    const [rows] = await this._pool.query('SELECT * FROM commodities');
    return rows;
  }

  async addCommodity({ name, unit }, userId) {
    try {
      const id = uuidv4();
      const query = 'INSERT INTO commodities (id, name, unit) VALUES (?, ?, ?)';
      await this._pool.execute(query, [id, name, unit]);
      
      if (this._logService && userId) {
        await this._logService.addLog({
          userId,
          action: 'ADD_COMMODITY',
          targetId: id,
          details: { name, unit }
        });
      }

      return id;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new InvariantError(`Komoditas dengan nama '${name}' sudah ada.`);
      }
      throw error;
    }
  }

  async updateCommodity(id, { name, unit }, userId) {
    try {
      const query = 'UPDATE commodities SET name = ?, unit = ? WHERE id = ?';
      const [result] = await this._pool.execute(query, [name, unit, id]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Komoditas tidak ditemukan');
      }

      if (this._logService && userId) {
        await this._logService.addLog({
          userId,
          action: 'UPDATE_COMMODITY',
          targetId: id,
          details: { name, unit }
        });
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new InvariantError(`Komoditas dengan nama '${name}' sudah ada.`);
      }
      throw error;
    }
  }

  async deleteCommodity(id, userId) {
    try {
      const query = 'DELETE FROM commodities WHERE id = ?';
      const [result] = await this._pool.execute(query, [id]);
      if (result.affectedRows === 0) {
        throw new NotFoundError('Komoditas tidak ditemukan');
      }

      if (this._logService && userId) {
        await this._logService.addLog({
          userId,
          action: 'DELETE_COMMODITY',
          targetId: id
        });
      }
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
        throw new InvariantError('Komoditas tidak dapat dihapus karena masih digunakan dalam data harga.');
      }
      throw error;
    }
  }
}

export default CommoditiesService;
