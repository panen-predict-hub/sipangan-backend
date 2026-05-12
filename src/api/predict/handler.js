/**
 * @openapi
 * components:
 *   schemas:
 *     Prediction:
 *       type: object
 *       properties:
 *         commodity:
 *           type: string
 *           example: Beras Medium
 *         region:
 *           type: string
 *           example: Jawa Tengah
 *         predictions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date: { type: string, format: date, example: "2024-05-13" }
 *               price: { type: number, example: 15650 }
 */

class PredictHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getPredictionHandler = this.getPredictionHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/predict:
   *   get:
   *     summary: Ambil prediksi harga pangan masa depan
   *     tags: [Predict]
   *     parameters:
   *       - in: query
   *         name: commodity
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: region
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Hasil prediksi harga
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: success }
   *                 data: { $ref: '#/components/schemas/Prediction' }
   */
  async getPredictionHandler(req, res, next) {
    try {
      const { commodity, region } = this._validator.validatePredictQuery(req.query);
      const data = await this._service.getPrediction(commodity, region);
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PredictHandler;
