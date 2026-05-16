import { query, pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Fetch cuaca dari openweathermap dan simpan ke database
  async syncWeatherForRegion(regionId, lat, lng) {
    if (!this.apiKey) {
      console.warn('WEATHER_API_KEY is not set in environment variables');
      return null;
    }

    try {
      // Mengambil data forecast 5 hari (tiap 3 jam)
      const response = await fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`);
      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const dailyData = {};

      // Agregasi atau ambil satu sampel per hari (misal jam 12 siang)
      data.list.forEach(item => {
        // item.dt_txt format: "2023-10-25 12:00:00"
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];

        // Pilih sampel jam 12:00:00 untuk mewakili hari tersebut
        // Jika belum ada data untuk tanggal ini, simpan sementara
        if (!dailyData[date] || time === '12:00:00') {
          dailyData[date] = {
            temperature: item.main.temp,
            humidity: item.main.humidity,
            weather_condition: item.weather[0].main // e.g. "Rain", "Clear"
          };
        }
      });

      // Simpan ke database
      const insertPromises = Object.entries(dailyData).map(async ([date, weather]) => {
        const id = uuidv4();
        const insertQuery = `
          INSERT INTO weather_data (id, region_id, date, temperature, humidity, weather_condition)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            temperature = VALUES(temperature),
            humidity = VALUES(humidity),
            weather_condition = VALUES(weather_condition)
        `;
        return pool.query(insertQuery, [id, regionId, date, weather.temperature, weather.humidity, weather.weather_condition]);
      });

      await Promise.all(insertPromises);
      return { success: true, count: Object.keys(dailyData).length };

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
