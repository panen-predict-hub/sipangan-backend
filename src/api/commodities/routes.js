import express from 'express';
import authMiddleware from '../../middleware/auth.js';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', handler.getCommoditiesHandler);
  router.post('/', authMiddleware, handler.postCommodityHandler);
  router.put('/:id', authMiddleware, handler.putCommodityHandler);
  router.delete('/:id', authMiddleware, handler.deleteCommodityHandler);

  return router;
};

export default routes;
