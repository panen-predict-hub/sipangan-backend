import { pool } from '../config/database.js';

class HistoryService {
  constructor() {
    this._pool = pool;
  }

  async getHistory({ commodity, region, start_date, end_date }) {
    let query = `
      SELECT p.id, p.price, p.date, c.name as commodity, c.unit, r.name as region
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      JOIN regions r ON p.region_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (commodity) {
      params.push(commodity);
      query += ` AND c.name = $${params.length}`;
    }

    if (region) {
      params.push(region);
      query += ` AND r.name = $${params.length}`;
    }

    if (start_date) {
      params.push(start_date);
      query += ` AND p.date >= $${params.length}`;
    }

    if (end_date) {
      params.push(end_date);
      query += ` AND p.date <= $${params.length}`;
    }

    query += ` ORDER BY p.date DESC`;

    const result = await this._pool.query(query, params);
    return result.rows;
  }

  async getOverview() {
    const query = `
      SELECT DISTINCT ON (c.id, r.id) 
        p.price, p.date, c.name as commodity, r.name as region
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      JOIN regions r ON p.region_id = r.id
      ORDER BY c.id, r.id, p.date DESC
    `;
    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default HistoryService;
