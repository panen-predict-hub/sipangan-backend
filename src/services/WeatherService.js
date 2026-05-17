import { query, pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Fetch cuaca dari openweathermap dan simpan ke database (Hanya data hari ini/current weather)
  async syncWeatherForRegion(regionId, lat, lng) {
    if (!this.apiKey) {
      console.warn('WEATHER_API_KEY is not set in environment variables');
      return null;
    }

    try {
      // Mengambil data cuaca saat ini (Current Weather) untuk hasil yang lebih akurat hari ini
      const response = await fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`);
      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Mendapatkan tanggal hari ini (Zona Waktu WIB / Asia/Jakarta)
      const dateObj = new Date();
      dateObj.setHours(dateObj.getUTCHours() + 7); // Offset UTC+7
      const today = dateObj.toISOString().split('T')[0];

      const weather = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        weather_condition: data.weather[0].main // e.g. "Rain", "Clear", "Clouds"
      };

      // Simpan ke database
      const id = uuidv4();
      const insertQuery = `
        INSERT INTO weather_data (id, region_id, date, temperature, humidity, weather_condition)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          temperature = VALUES(temperature),
          humidity = VALUES(humidity),
          weather_condition = VALUES(weather_condition)
      `;
      
      await pool.query(insertQuery, [id, regionId, today, weather.temperature, weather.humidity, weather.weather_condition]);

      return { success: true, count: 1 };

    } catch (error) {
      console.error(`Error syncing weather for region ${regionId}:`, error);
      throw error;
    }
  }

  // Trigger sync untuk semua region
  async syncAllRegions() {
    const { rows: regions } = await query("SELECT id, latitude as lat, longitude as lng FROM regions WHERE latitude IS NOT NULL AND longitude IS NOT NULL");

    const results = [];
    for (const region of regions) {
      const result = await this.syncWeatherForRegion(region.id, region.lat, region.lng);
      results.push({ regionId: region.id, ...result });
    }
    return results;
  }

  // Mengambil data cuaca yang tersimpan di database untuk region tertentu
  async getWeatherByRegion(regionId) {
    const q = `
      SELECT date, temperature, humidity, weather_condition
      FROM weather_data
      WHERE region_id = ? AND date >= CURDATE()
      ORDER BY date ASC
    `;
    const { rows } = await query(q, [regionId]);
    return rows;
  }
}

export default WeatherService;
