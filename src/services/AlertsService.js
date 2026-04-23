import { query } from '../config/database.js';

class AlertsService {
  async getAlerts(queryObj) {
    let queryText = 'SELECT * FROM alerts';
    const queryParams = [];
    let paramIndex = 1;

    // Filter based on region
    if (queryObj.regionId) {
      queryText += ' WHERE region_id = ?';
      queryParams.push(queryObj.regionId);
    }

    // Filter based on commodity
    if (queryObj.commodityId) {
      if (queryObj.regionId) {
        queryText += ' AND commodity_id = ?';
      } else {
        queryText += ' WHERE commodity_id = ?';
      }
      queryParams.push(queryObj.commodityId);
    }

    // Filter by price threshold
    if (queryObj.priceThreshold) {
      if (queryObj.regionId || queryObj.commodityId) {
        queryText += ` AND price >= ?`;
      } else {
        queryText += ` WHERE price >= ?`;
      }
      queryParams.push(queryObj.priceThreshold);
    }

    queryText += ' ORDER BY created_at DESC';

    const { rows } = await query(queryText, queryParams);
    return rows;
  }
}

export default AlertsService;
