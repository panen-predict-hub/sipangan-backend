/**
 * @openapi
 * components:
 *   schemas:
 *     Alert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5
 *         title:
 *           type: string
 *           example: Harga Beras Naik di Jawa Tengah
 *         message:
 *           type: string
 *           example: Terjadi kenaikan harga sebesar 15% dalam 3 hari terakhir.
 *         type:
 *           type: string
 *           example: warning
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-05-12T10:00:00Z"
 */

class AlertsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getAlertsHandler = this.getAlertsHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/alerts:
   *   get:
   *     summary: Ambil daftar peringatan harga
   *     tags: [Alerts]
   *     parameters:
   *       - in: query
   *         name: region
   *         schema: { type: string }
   *         description: Nama wilayah
   *     responses:
   *       200:
   *         description: Daftar peringatan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: success }
   *                 data:
   *                   type: array
   *                   items: { $ref: '#/components/schemas/Alert' }
   */
  async getAlertsHandler(req, res, next) {
    try {
      const validatedQuery = this._validator.validateAlertsQuery(req.query);
      const alerts = await this._service.getAlerts(validatedQuery);
      res.status(200).json({
        status: 'success',
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AlertsHandler;
