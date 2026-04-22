import { query } from '../config/database.js';

class MapsService {
  async getRegionCoordinates() {
    const result = await query('SELECT id, name, latitude, longitude FROM regions');
    return result.rows;
  }
}

export default MapsService;
