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
      baseQuery += ` AND c.name = $${params.length}`;
    }

    if (region) {
      params.push(region);
      baseQuery += ` AND r.name = $${params.length}`;
    }

    if (start_date) {
      params.push(start_date);
      baseQuery += ` AND p.date >= $${params.length}`;
    }

    if (end_date) {
      params.push(end_date);
      baseQuery += ` AND p.date <= $${params.length}`;
    }

    // Count total rows for pagination metadata
    const countResult = await this._pool.query(
      `SELECT COUNT(*) FROM (${baseQuery}) AS total_count`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Apply ordering and pagination
    const offset = (page - 1) * limit;
    params.push(limit);
    const dataQuery = baseQuery + ` ORDER BY p.date DESC LIMIT $${params.length}`;
    params.push(offset);
    const finalQuery = dataQuery + ` OFFSET $${params.length}`;

    const result = await this._pool.query(finalQuery, params);

    return {
      items: result.rows,
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

