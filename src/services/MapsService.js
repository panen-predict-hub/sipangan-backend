import { query } from '../config/database.js';

class MapsService {
  async getRegionCoordinates() {
    // Menambahkan placeholder status (nanti diisi oleh analisis AI)
    const { rows } = await query("SELECT id, name, latitude as lat, longitude as lng FROM regions");
    return rows;
  }
}

export default MapsService;
