import { jest } from '@jest/globals';

// Mock database
const mockPoolQuery = jest.fn();
const mockQuery = jest.fn();

jest.unstable_mockModule('../../src/config/database.js', () => ({
  pool: {
    query: mockPoolQuery,
  },
  query: mockQuery,
}));

// Mock global fetch
global.fetch = jest.fn();

const { default: WeatherService } = await import('../../src/services/WeatherService.js');
const { pool, query } = await import('../../src/config/database.js');

describe('WeatherService', () => {
  let weatherService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set mock env var
    process.env.WEATHER_API_KEY = 'test-api-key';
    weatherService = new WeatherService();
  });

  afterEach(() => {
    delete process.env.WEATHER_API_KEY;
  });

  describe('syncWeatherForRegion', () => {
    it('should return null if API key is not set', async () => {
      delete process.env.WEATHER_API_KEY;
      const serviceWithoutKey = new WeatherService();
      
      const result = await serviceWithoutKey.syncWeatherForRegion('region-1', -7.250445, 112.768845);
      expect(result).toBeNull();
    });

    it('should throw an error if API response is not ok', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      await expect(
        weatherService.syncWeatherForRegion('region-1', -7.250445, 112.768845)
      ).rejects.toThrow('Weather API Error: Unauthorized');
    });

    it('should fetch weather and insert into database', async () => {
      const mockApiResponse = {
        main: { temp: 30, humidity: 70 },
        weather: [{ main: 'Clouds' }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      pool.query.mockResolvedValueOnce([{}]);

      const result = await weatherService.syncWeatherForRegion('region-1', -7.250445, 112.768845);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=-7.250445&lon=112.768845&appid=test-api-key&units=metric'
      );
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true, count: 1 });
    });
  });

  describe('syncAllRegions', () => {
    it('should sync weather for all regions with lat and lng', async () => {
      const mockRegions = [
        { id: 'region-1', lat: -7.25, lng: 112.76 },
        { id: 'region-2', lat: -7.98, lng: 112.63 },
      ];

      query.mockResolvedValueOnce({ rows: mockRegions });

      // Mock the internal method
      weatherService.syncWeatherForRegion = jest.fn().mockResolvedValue({ success: true, count: 5 });

      const results = await weatherService.syncAllRegions();

      expect(query).toHaveBeenCalledWith(
        'SELECT id, latitude as lat, longitude as lng FROM regions WHERE latitude IS NOT NULL AND longitude IS NOT NULL'
      );
      expect(weatherService.syncWeatherForRegion).toHaveBeenCalledTimes(2);
      expect(weatherService.syncWeatherForRegion).toHaveBeenCalledWith('region-1', -7.25, 112.76);
      expect(weatherService.syncWeatherForRegion).toHaveBeenCalledWith('region-2', -7.98, 112.63);
      expect(results.length).toBe(2);
      expect(results[0]).toEqual({ regionId: 'region-1', success: true, count: 5 });
    });
  });

  describe('getWeatherByRegion', () => {
    it('should return weather data for a specific region', async () => {
      const mockRows = [
        { date: '2023-10-25', temperature: 30, humidity: 70, weather_condition: 'Clear' },
      ];

      query.mockResolvedValueOnce({ rows: mockRows });

      const result = await weatherService.getWeatherByRegion('region-1');

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT date, temperature, humidity, weather_condition'),
        ['region-1']
      );
      expect(result).toEqual(mockRows);
    });
  });
});
