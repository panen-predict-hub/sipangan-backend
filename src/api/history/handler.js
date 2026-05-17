import { clearCache } from '../../middleware/cache.js';

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
   * /api/v1/prices:
   *   get:
   *     summary: Ambil riwayat harga pangan
   *     tags: [Prices]
   *     parameters:
   *       - in: query
   *         name: commodity
   *         schema: { type: string }
   *         description: Nama komoditas
   *       - in: query
   *         name: region
   *         schema: { type: string }
   *         description: Nama wilayah
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
   * /api/v1/prices/overview:
   *   get:
   *     summary: Ambil ringkasan harga dan status risiko per wilayah (Highest Risk Aggregation)
   *     tags: [Prices]
   *     responses:
   *       200:
   *         description: Data ringkasan harga per wilayah
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: success }
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       region: { type: string, example: "Kota Surabaya" }
   *                       current_price: { type: number, example: 15000 }
   *                       average_price: { type: number, example: 14500 }
   *                       predicted_price: { type: number, example: 15500 }
   *                       status: { type: string, example: "waspada" }
   */
  async getOverviewHandler(req, res, next) {
    try {
      const { commodity } = req.query;
      const rawOverview = await this._service.getOverview(commodity);

      // Logika Aggregasi "Highest-Risk-Level" per Wilayah
      const statusPriority = { 'tanpa data': 0, 'aman': 1, 'waspada': 2, 'kritis': 3 };

      const aggregated = rawOverview.reduce((acc, item) => {
        const region = item.region_name;
        const currentPrio = statusPriority[item.status] || 0;

        if (!acc[region]) {
          acc[region] = {
            region_id: item.region_id,
            region_name: item.region_name,
            current_price: item.current_price,
            previous_price: item.previous_price,
            trend: item.trend,
            percent_change: item.percent_change,
            status: item.status,
            last_update: item.last_update,
            prio: currentPrio
          };
        } else {
          // Jika tidak ada commodity yang dipilih, ambil data dari komoditas yang paling berisiko
          if (currentPrio > acc[region].prio) {
            acc[region].prio = currentPrio;
            acc[region].status = item.status;
            acc[region].current_price = item.current_price;
            acc[region].previous_price = item.previous_price;
            acc[region].trend = item.trend;
            acc[region].percent_change = item.percent_change;
            acc[region].last_update = item.last_update;
          }
        }
        return acc;
      }, {});

      const data = Object.values(aggregated).map(({ prio, ...rest }) => rest);

      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/prices:
   *   post:
   *     summary: Tambah data harga baru
   *     tags: [Prices]
   *     security:
   *       - apiKeyAuth: []
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
      const priceId = await this._service.addPrice(validatedPayload, req.user.id);

      res.status(201).json({
        status: 'success',
        message: 'Data harga berhasil ditambahkan',
        data: {
          priceId,
        },
      });

      // Bersihkan cache agar data terbaru muncul di /overview dan /prices
      await clearCache('cache:/api/v1/prices*');
      await clearCache('cache:/api/v1/alerts*');
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/prices/{id}:
   *   put:
   *     summary: Perbarui data harga
   *     tags: [Prices]
   *     security:
   *       - apiKeyAuth: []
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
      await this._service.updatePrice(id, validatedPayload, req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Data harga berhasil diperbarui',
      });

      // Bersihkan cache agar data terbaru muncul di /overview dan /prices
      await clearCache('cache:/api/v1/prices*');
      await clearCache('cache:/api/v1/alerts*');
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/prices/{id}:
   *   delete:
   *     summary: Hapus data harga
   *     tags: [Prices]
   *     security:
   *       - apiKeyAuth: []
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
      await this._service.deletePrice(id, req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Data harga berhasil dihapus',
      });

      // Bersihkan cache agar data terbaru muncul di /overview dan /prices
      await clearCache('cache:/api/v1/prices*');
      await clearCache('cache:/api/v1/alerts*');
    } catch (error) {
      next(error);
    }
  }
}

export default HistoryHandler;
