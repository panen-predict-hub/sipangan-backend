import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import cacheMiddleware from '../../middleware/cache.js';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', cacheMiddleware(3600), handler.getCommoditiesHandler);
  router.post('/', authMiddleware, handler.postCommodityHandler);
  router.put('/:id', authMiddleware, handler.putCommodityHandler);
  router.put('/:id/threshold', authMiddleware, handler.putThresholdHandler);
  router.delete('/:id', authMiddleware, handler.deleteCommodityHandler);

  return router;
};

export default routes;
