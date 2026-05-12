import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database.js';
import NotFoundError from '../utils/exceptions/NotFoundError.js';

class HistoryService {
  constructor() {
    this._pool = pool;
  }

  async getHistory({ commodity, region, start_date, end_date, page = 1, limit = 20 }) {
    let baseQuery = `
      SELECT p.id, p.price, p.date, c.name as commodity, c.unit, r.name as region
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      JOIN regions r ON p.region_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (commodity) {
      params.push(commodity);
      baseQuery += ` AND c.name = ?`;
    }

    if (region) {
      params.push(region);
      baseQuery += ` AND r.name = ?`;
    }

    if (start_date) {
      params.push(start_date);
      baseQuery += ` AND p.date >= ?`;
    }

    if (end_date) {
      params.push(end_date);
      baseQuery += ` AND p.date <= ?`;
    }

    // Count total rows for pagination metadata
    const [countRows] = await this._pool.query(
      `SELECT COUNT(*) as count FROM (${baseQuery}) AS total_count`,
      params
    );
    const total = parseInt(countRows[0].count, 10);

    // Apply ordering and pagination
    const limitNum = Number(limit);
    const offsetNum = (Number(page) - 1) * limitNum;
    
    const finalQuery = baseQuery + ` ORDER BY p.date DESC LIMIT ? OFFSET ?`;
    const finalParams = [...params, limitNum, offsetNum];

    const [rows] = await this._pool.query(finalQuery, finalParams);

    return {
      items: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOverview() {
    const query = `
      SELECT price, date, commodity, region FROM (
        SELECT p.price, p.date, c.name as commodity, r.name as region,
        ROW_NUMBER() OVER(PARTITION BY c.id, r.id ORDER BY p.date DESC) as rn
        FROM prices p
        JOIN commodities c ON p.commodity_id = c.id
        JOIN regions r ON p.region_id = r.id
      ) as ranked
      WHERE rn = 1
    `;
    const [rows] = await this._pool.query(query);
    return rows;
  }

  async addPrice({ commodity_id, region_id, price, date }) {
    const id = uuidv4();
    const query = `INSERT INTO prices (id, commodity_id, region_id, price, date) VALUES (?, ?, ?, ?, ?)`;
    await this._pool.query(query, [id, commodity_id, region_id, price, date]);
    return id;
  }

  async updatePrice(id, { commodity_id, region_id, price, date }) {
    await this.verifyPriceExistence(id);
    const query = `UPDATE prices SET commodity_id = ?, region_id = ?, price = ?, date = ? WHERE id = ?`;
    await this._pool.query(query, [commodity_id, region_id, price, date, id]);
  }

  async deletePrice(id) {
    await this.verifyPriceExistence(id);
    const query = `DELETE FROM prices WHERE id = ?`;
    await this._pool.query(query, [id]);
  }

  async verifyPriceExistence(id) {
    const query = `SELECT id FROM prices WHERE id = ?`;
    const [rows] = await this._pool.query(query, [id]);

    if (!rows.length) {
      throw new NotFoundError('Data harga tidak ditemukan');
    }
  }
}

export default HistoryService;

