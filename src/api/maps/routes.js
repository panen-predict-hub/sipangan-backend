import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/maps:
   *   get:
   *     summary: Get region coordinates and price status
   *     description: Retrieve coordinates and price status (tinggi/normal) for maps.
   *     tags: [Maps]
   *     responses:
   *       200:
   *         description: List of regions with lat, lng, and status.
   */
  router.get('/', handler.getRegionCoordinatesHandler);

  return router;
};

export default routes;
