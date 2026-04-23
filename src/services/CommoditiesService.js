import { query } from '../config/database.js';

class CommoditiesService {
  async getCommodities() {
    const { rows } = await query('SELECT id, name, unit FROM commodities');
    return rows;
  }
}

export default CommoditiesService;
