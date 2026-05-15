import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database.js';
import ServiceUnavailableError from '../utils/exceptions/ServiceUnavailableError.js';

class PredictService {
  constructor() {
    this._pool = pool;
    this._fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
  }

  async getPrediction(commodityName, regionName, commodityId = null, regionId = null) {
    // 1. Try to find prediction in DB first (for today or upcoming dates)
    if (commodityId && regionId) {
      try {
        const [rows] = await this._pool.query(
          'SELECT price, prediction_date FROM predictions WHERE commodity_id = ? AND region_id = ? AND prediction_date >= CURDATE() ORDER BY prediction_date ASC LIMIT 1',
          [commodityId, regionId]
        );

        if (rows.length > 0) {
          return {
            status: 'success',
            predictions: rows.map(r => ({
              date: r.prediction_date,
              price: parseFloat(r.price)
            }))
          };
        }
      } catch (dbError) {
        console.error('Database error in PredictService:', dbError);
        // Continue to API if DB fails
      }
    }

    // 2. Fetch from FastAPI if not in DB
    try {
      const response = await fetch(
        `${this._fastApiUrl}/predict?commodity=${encodeURIComponent(commodityName)}&region=${encodeURIComponent(regionName)}`
      );

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();

      // 3. Save to DB if we have IDs and data
      if (commodityId && regionId && data.predictions && data.predictions.length > 0) {
        try {
          const predictionsToSave = data.predictions.map(p => [
            uuidv4(),
            commodityId,
            regionId,
            p.price,
            p.date
          ]);

          await this._pool.query(
            'INSERT IGNORE INTO predictions (id, commodity_id, region_id, price, prediction_date) VALUES ?',
            [predictionsToSave]
          );
        } catch (saveError) {
          console.error('Failed to save predictions to DB:', saveError);
        }
      }

      return data;
    } catch (err) {
      if (err instanceof ServiceUnavailableError) throw err;
      throw new ServiceUnavailableError('AI Prediction service currently unavailable');
    }
  }
}

export default PredictService;
