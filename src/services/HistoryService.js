import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database.js';
import NotFoundError from '../utils/exceptions/NotFoundError.js';

class HistoryService {
  constructor(predictService) {
    this._pool = pool;
    this._predictService = predictService;
  }

  async getHistory({ commodity, region, start_date, end_date, page = 1, limit = 20 }) {
    let baseQuery = `
      SELECT p.id, p.commodity_id, p.region_id, p.price, p.date, c.name as commodity, c.unit, r.name as region
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      JOIN regions r ON p.region_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (commodity) {
      params.push(`%${commodity}%`);
      baseQuery += ` AND LOWER(c.name) LIKE LOWER(?)`;
    }

    if (region) {
      params.push(`%${region}%`);
      baseQuery += ` AND LOWER(r.name) LIKE LOWER(?)`;
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

  async getOverview(commodityName) {
    let whereClause = '';
    const params = [];

    if (commodityName) {
      whereClause = 'WHERE c.name = ?';
      params.push(commodityName);
    }

    const query = `
      WITH LatestPrices AS (
        SELECT
            p.commodity_id,
            p.region_id,
            p.price as current_price,
            c.name as commodity_name,
            r.name as region_name,
            ROW_NUMBER() OVER(PARTITION BY p.commodity_id, p.region_id ORDER BY p.date DESC) as rn
        FROM prices p
        JOIN commodities c ON p.commodity_id = c.id
        JOIN regions r ON p.region_id = r.id
        ${whereClause}
      ),
      AveragePrices AS (
        SELECT
            commodity_id,
            region_id,
            AVG(price) as average_price
        FROM (
            SELECT
                commodity_id,
                region_id,
                price,
                ROW_NUMBER() OVER(PARTITION BY commodity_id, region_id ORDER BY date DESC) as rank_num
            FROM prices
        ) as ranked_prices
        WHERE rank_num <= 12
        GROUP BY commodity_id, region_id
      )
      SELECT
          lp.region_name as region,
          lp.commodity_name as commodity,
          lp.current_price,
          ap.average_price
      FROM LatestPrices lp
      LEFT JOIN AveragePrices ap ON lp.commodity_id = ap.commodity_id AND lp.region_id = ap.region_id
      WHERE lp.rn = 1
    `;

    const [rows] = await this._pool.query(query, params);

    const result = await Promise.all(rows.map(async (row) => {
      let predictedPrice = null; // Default null if prediction is not available

      if (this._predictService) {
        try {
          const prediction = await this._predictService.getPrediction(row.commodity, row.region);
          if (prediction && prediction.predictions && prediction.predictions.length > 0) {
            predictedPrice = prediction.predictions[0].price;
          }
        } catch (error) {
          console.error(`Prediction failed for ${row.commodity} in ${row.region}:`, error.message);
        }
      }

      const status = this._calculateStatus(row.current_price, predictedPrice, row.average_price);

      return {
        region: row.region,
        commodity: row.commodity,
        current_price: parseFloat(row.current_price),
        average_price: parseFloat(row.average_price || 0),
        predicted_price: predictedPrice ? parseFloat(predictedPrice) : null,
        status,
      };
    }));

    return result;
  }

  _calculateStatus(current, predicted, average) {
    if (!average) return 'normal';

    const getLevel = (price, avg) => {
      if (price === null || price === undefined) return -1; // Ignore if no data
      const ratio = price / avg;
      if (ratio <= 1.0) return 0; // aman (<= average)
      if (ratio <= 1.1) return 1; // normal (up to 10% above average)
      if (ratio <= 1.25) return 2; // waspada (10-25% above average)
      return 3; // kritis (> 25% above average)
    };

    const currentLevel = getLevel(current, average);
    const predictedLevel = getLevel(predicted, average);

    // Logic: "highest-risk-level". If predicted is null (-1), it won't affect the max.
    const highestLevel = Math.max(currentLevel, predictedLevel);

    const statuses = ['aman', 'normal', 'waspada', 'kritis'];
    // Fallback to 'aman' if for some reason highestLevel is -1
    return statuses[highestLevel] || 'aman';
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
