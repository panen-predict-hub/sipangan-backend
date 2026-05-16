import express from 'express';
import cacheMiddleware from '../../middleware/cache.js';
import authMiddleware from '../../middleware/auth.js';

const routes = (handler) => {
  const router = express.Router();

  // Public endpoint with caching (e.g. 1 hour cache = 3600 seconds)
  router.get('/region/:regionId', cacheMiddleware(3600), handler.getWeatherByRegionHandler);

  // Protect sync endpoint - only admin/super_admin can trigger manually
  router.post('/sync', authMiddleware, handler.syncWeatherHandler);

  return router;
};

export default routes;
