import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', handler.getAlertsHandler);

  return router;
};

export default routes;
