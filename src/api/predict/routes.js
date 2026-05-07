import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', handler.getPredictionHandler);

  return router;
};

export default routes;
