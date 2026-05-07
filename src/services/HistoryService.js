import { pool } from '../config/database.js';

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
    // Use pool.query for better compatibility with nested queries and limits
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

    // Use pool.query here as well to avoid prepared statement issues with LIMIT
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
}

export default HistoryService;

