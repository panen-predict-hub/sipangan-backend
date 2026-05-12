import express from 'express';
import authMiddleware from '../../middleware/auth.js';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', handler.getHistoryHandler);
  router.get('/overview', handler.getOverviewHandler);
  
  // Protected routes
  router.post('/', authMiddleware, handler.postPriceHandler);
  router.put('/:id', authMiddleware, handler.putPriceHandler);
  router.delete('/:id', authMiddleware, handler.deletePriceHandler);

  return router;
};
  
export default routes;