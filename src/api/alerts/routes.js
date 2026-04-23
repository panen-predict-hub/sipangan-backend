import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/alerts:
   *   get:
   *     summary: Get peringatan harga padi
   *     description: Mendapatkan peringatan real-time untuk perubahan harga padi yang signifikan.
   *     tags: [Alerts]
   *     responses:
   *       200:
   *         description: A list of active alerts.
   *       500:
   *         description: Internal server error.
   */
  router.get('/', handler.getAlertsHandler);

  return router;
};

export default routes;
