import express from 'express';
import cacheMiddleware from '../../middleware/cache.js';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', cacheMiddleware(60), handler.getAlertsHandler);

  return router;
};

export default routes;
