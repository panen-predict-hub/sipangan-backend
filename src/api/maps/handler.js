/**
 * @openapi
 * components:
 *   schemas:
 *     RegionCoordinate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           example: Jawa Tengah
 *         latitude:
 *           type: number
 *           example: -7.150975
 *         longitude:
 *           type: number
 *           example: 110.140259
 */

class MapsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getRegionCoordinatesHandler = this.getRegionCoordinatesHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/maps:
   *   get:
   *     summary: Ambil koordinat wilayah untuk peta
   *     tags: [Maps]
   *     responses:
   *       200:
   *         description: Daftar koordinat wilayah
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: success }
   *                 data:
   *                   type: array
   *                   items: { $ref: '#/components/schemas/RegionCoordinate' }
   */
  async getRegionCoordinatesHandler(req, res, next) {
    try {
      this._validator.validateMapsQuery(req.query);
      const coordinates = await this._service.getRegionCoordinates();
      res.status(200).json({
        status: 'success',
        data: coordinates,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default MapsHandler;
