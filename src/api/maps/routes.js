import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.get('/', handler.getRegionCoordinatesHandler);

  return router;
};

export default routes;
