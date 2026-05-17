import { clearCache } from '../../middleware/cache.js';

class WeatherHandler {
  constructor(weatherService) {
    this._weatherService = weatherService;

    this.getWeatherByRegionHandler = this.getWeatherByRegionHandler.bind(this);
    this.syncWeatherHandler = this.syncWeatherHandler.bind(this);
  }

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
