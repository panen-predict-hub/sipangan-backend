import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/prices:
   *   get:
   *     summary: Get riwayat harga padi
   *     description: Mengambil data riwayat harga untuk komoditas padi.
   *     tags: [History]
   *     responses:
   *       200:
   *         description: A list of price history records.
   *       500:
   *         description: Internal server error.
   */
  router.get('/', (req, res, next) => handler.getHistoryHandler(req, res, next));

  /**
   * @swagger
   * /api/v1/prices/overview:
   *   get:
   *     summary: Get ringkasan tren harga padi
   *     description: Mengambil ringkasan tren harga padi untuk dashboard.
   *     tags: [History]
   *     responses:
   *       200:
   *         description: Overview data for prices.
   *       500:
   *         description: Internal server error.
   */
  router.get('/overview', (req, res, next) => handler.getOverviewHandler(req, res, next));

  return router;
};
  
export default routes;