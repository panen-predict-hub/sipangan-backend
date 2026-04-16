import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', handler.getHistoryHandler);
  router.get('/overview', handler.getOverviewHandler);

  return router;
};

export default routes;