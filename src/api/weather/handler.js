import { clearCache } from '../../middleware/cache.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     Weather:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2026-05-17"
 *         temperature:
 *           type: number
 *           example: 31.5
 *         humidity:
 *           type: number
 *           example: 75
 *         weather_condition:
 *           type: string
 *           example: "Clouds"
 */

class WeatherHandler {
  constructor(weatherService) {
    this._weatherService = weatherService;

    this.getWeatherByRegionHandler = this.getWeatherByRegionHandler.bind(this);
    this.syncWeatherHandler = this.syncWeatherHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/weather/region/{regionId}:
   *   get:
   *     summary: Ambil data ramalan cuaca untuk wilayah tertentu
   *     description: Mengembalikan daftar prakiraan cuaca harian (suhu, kelembaban, kondisi) mulai dari hari ini hingga 5 hari ke depan. Hasil di-cache di Redis selama 1 jam.
   *     tags: [Weather]
   *     parameters:
   *       - in: path
   *         name: regionId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID wilayah (region)
   *     responses:
   *       200:
   *         description: Sukses mengambil data cuaca
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: "success" }
   *                 data:
   *                   type: object
   *                   properties:
   *                     weather:
   *                       type: array
   *                       items: { $ref: '#/components/schemas/Weather' }
   *       500:
   *         description: Server error
   */
  async getWeatherByRegionHandler(req, res, next) {
    try {
      const { regionId } = req.params;
      const weatherData = await this._weatherService.getWeatherByRegion(regionId);

      res.status(200).json({
        status: 'success',
        data: {
          weather: weatherData,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/weather/sync:
   *   post:
   *     summary: Sinkronisasi manual data cuaca dari OpenWeatherMap
   *     description: Memicu sinkronisasi data prakiraan cuaca 5 hari ke depan untuk semua wilayah yang memiliki koordinat latitude dan longitude. Otomatis membersihkan Redis cache cuaca. Memerlukan autentikasi JWT Admin.
   *     tags: [Weather]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Sinkronisasi cuaca berhasil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: "success" }
   *                 message: { type: string, example: "Weather synchronization completed" }
   *                 data:
   *                   type: object
   *                   properties:
   *                     results:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           regionId: { type: string, example: "r-12345" }
   *                           success: { type: boolean, example: true }
   *                           count: { type: number, example: 5 }
   *       401:
   *         description: Tidak terautentikasi (Token tidak valid / tidak ada)
   *       403:
   *         description: Akses ditolak (Bukan Admin)
   *       500:
   *         description: Kesalahan server saat sinkronisasi
   */
  async syncWeatherHandler(req, res, next) {
    try {
      const results = await this._weatherService.syncAllRegions();
      await clearCache('cache:*/weather/region*');

      res.status(200).json({
        status: 'success',
        message: 'Weather synchronization completed',
        data: {
          results,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default WeatherHandler;
