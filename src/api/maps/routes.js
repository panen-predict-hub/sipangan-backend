import express from 'express';
import cacheMiddleware from '../../middleware/cache.js';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', cacheMiddleware(86400), handler.getRegionCoordinatesHandler);

  return router;
};

export default routes;
