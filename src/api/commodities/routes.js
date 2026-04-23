import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/commodities:
   *   get:
   *     summary: Get list of commodities
   *     description: Retrieve all available food commodities (e.g., Beras Medium).
   *     tags: [Commodities]
   *     responses:
   *       200:
   *         description: A list of commodities.
   */
  router.get('/', handler.getCommoditiesHandler);

  return router;
};

export default routes;
