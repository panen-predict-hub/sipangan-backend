/**
 * @openapi
 * components:
 *   schemas:
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         username:
 *           type: string
 *         fullname:
 *           type: string
 *         user_role:
 *           type: string
 *         action:
 *           type: string
 *           example: "UPDATE_PRICE"
 *         target_id:
 *           type: string
 *         target_username:
 *           type: string
 *         target_fullname:
 *           type: string
 *         target_role:
 *           type: string
 *         details:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

class LogsHandler {
  constructor(logService) {
    this._logService = logService;
    this.getLogsHandler = this.getLogsHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/logs:
   *   get:
   *     summary: Ambil Log Aktivitas Admin
   *     description: Mengambil riwayat aksi yang dilakukan oleh admin. Super Admin melihat semua, Admin hanya melihat bawahan mereka.
   *     tags: [Logs]
   *     security:
   *       - apiKeyAuth: []
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, default: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, default: 50 }
   *     responses:
   *       200:
   *         description: Daftar log aktivitas berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: success }
   *                 data:
   *                   type: object
   *                   properties:
   *                     logs:
   *                       type: array
   *                       items: { $ref: '#/components/schemas/ActivityLog' }
   */
  async getLogsHandler(req, res, next) {
    try {
      const { page, limit } = req.query;
      const logs = await this._logService.getLogs({
        role: req.user.role,
        userId: req.user.id,
        page: parseInt(page || '1'),
        limit: parseInt(limit || '50')
      });

      res.json({ status: 'success', data: { logs } });
    } catch (error) {
      next(error);
    }
  }
}

export default LogsHandler;
