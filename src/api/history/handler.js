/**
 * @openapi
 * components:
 *   schemas:
 *     Price:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 550e8400-e29b-411d-a716-446655440000
 *         price:
 *           type: number
 *           example: 15500
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-05-12"
 *         commodity:
 *           type: string
 *           example: Beras Medium
 *         unit:
 *           type: string
 *           example: kg
 *         region:
 *           type: string
 *           example: Jawa Tengah
 *     PriceInput:
 *       type: object
 *       required:
 *         - commodity_id
 *         - region_id
 *         - price
 *         - date
 *       properties:
 *         commodity_id:
 *           type: string
 *           example: c81b3762-9721-4775-8667-897782b7b55c
 *         region_id:
 *           type: string
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         price:
 *           type: number
 *           example: 16000
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-05-12"
 */

class HistoryHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getHistoryHandler = this.getHistoryHandler.bind(this);
    this.getOverviewHandler = this.getOverviewHandler.bind(this);
    this.postPriceHandler = this.postPriceHandler.bind(this);
    this.putPriceHandler = this.putPriceHandler.bind(this);
    this.deletePriceHandler = this.deletePriceHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/history:
   *   get:
   *     summary: Ambil riwayat harga pangan
   *     tags: [History]
   *     parameters:
   *       - in: query
   *         name: commodity
   *         schema: { type: string }
   *         description: Nama komoditas
   *       - in: query
   *         name: region
   *         schema: { type: string }
   *         description: Nama wilayah
   *       - in: query
   *         name: start_date
   *         schema: { type: string, format: date }
   *       - in: query
   *         name: end_date
   *         schema: { type: string, format: date }
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 20 }
   *     responses:
   *       200:
   *         description: Daftar harga pangan
   */
  async getHistoryHandler(req, res, next) {
    try {
      const validatedQuery = this._validator.validateHistoryQuery(req.query);
      const result = await this._service.getHistory(validatedQuery);
      res.status(200).json({
        status: 'success',
        data: result.items,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/history/overview:
   *   get:
   *     summary: Ambil ringkasan harga terbaru per komoditas
   *     tags: [History]
   *     responses:
   *       200:
   *         description: Data ringkasan harga
   */
  async getOverviewHandler(req, res, next) {
    try {
      const overview = await this._service.getOverview();
      res.status(200).json({
        status: 'success',
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/history:
   *   post:
   *     summary: Tambah data harga baru
   *     tags: [History]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PriceInput'
   *     responses:
   *       201:
   *         description: Data berhasil ditambahkan
   *       401:
   *         description: Unauthorized
   */
  async postPriceHandler(req, res, next) {
    try {
      const validatedPayload = this._validator.validatePricePayload(req.body);
      const priceId = await this._service.addPrice(validatedPayload);

      res.status(201).json({
        status: 'success',
        message: 'Data harga berhasil ditambahkan',
        data: {
          priceId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/history/{id}:
   *   put:
   *     summary: Perbarui data harga
   *     tags: [History]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PriceInput'
   *     responses:
   *       200:
   *         description: Data berhasil diperbarui
   */
  async putPriceHandler(req, res, next) {
    try {
      const { id } = req.params;
      const validatedPayload = this._validator.validatePricePayload(req.body);
      await this._service.updatePrice(id, validatedPayload);

      res.status(200).json({
        status: 'success',
        message: 'Data harga berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/history/{id}:
   *   delete:
   *     summary: Hapus data harga
   *     tags: [History]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Data berhasil dihapus
   */
  async deletePriceHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deletePrice(id);

      res.status(200).json({
        status: 'success',
        message: 'Data harga berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default HistoryHandler;