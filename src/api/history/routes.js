import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', (req, res, next) => handler.getHistoryHandler(req, res, next));
  router.get('/overview', (req, res, next) => handler.getOverviewHandler(req, res, next));

  return router;
};
  
export default routes;