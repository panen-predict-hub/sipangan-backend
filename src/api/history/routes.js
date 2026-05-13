import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import cacheMiddleware from '../../middleware/cache.js';
const routes = (handler) => {
  const router = express.Router();

  router.get('/', cacheMiddleware(3600), handler.getHistoryHandler);
  router.get('/overview', cacheMiddleware(3600), handler.getOverviewHandler);

  // Protected routes
  router.post('/', authMiddleware, handler.postPriceHandler);
  router.put('/:id', authMiddleware, handler.putPriceHandler);
  router.delete('/:id', authMiddleware, handler.deletePriceHandler);

  return router;
};

export default routes;
