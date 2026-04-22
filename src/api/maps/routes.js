import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.get('/regions', handler.getRegionCoordinatesHandler);

  return router;
};

export default routes;
