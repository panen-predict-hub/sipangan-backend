import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/v1/predict:
   *   get:
   *     summary: Get prediksi harga padi (AI)
   *     description: Mendapatkan perkiraan harga padi di masa depan menggunakan model AI.
   *     tags: [Predict]
   *     responses:
   *       200:
   *         description: Prediction data.
   *       500:
   *         description: Internal server error.
   */
  router.get('/', handler.getPredictionHandler);

  return router;
};

export default routes;
