/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-411d-a716-446655440000"
 *         username:
 *           type: string
 *           example: "admin_pamekasan"
 *         fullname:
 *           type: string
 *           example: "Admin Pamekasan"
 *         role:
 *           type: string
 *           enum: [super_admin, admin, operator]
 *           example: "admin"
 *         created_by:
 *           type: string
 *           example: "12345678-1234-1234-1234-123456789012"
 *         created_at:
 *           type: string
 *           format: date-time
 *     UserInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - fullname
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           example: "operator_01"
 *         password:
 *           type: string
 *           example: "pass123"
 *         fullname:
 *           type: string
 *           example: "Operator Baru"
 *         role:
 *           type: string
 *           enum: [admin, operator]
 *           example: "operator"
 */

class UsersHandler {
  constructor(userService, logService) {
    this._userService = userService;
    this._logService = logService;

    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.postUserHandler = this.postUserHandler.bind(this);
    this.putUserHandler = this.putUserHandler.bind(this);
    this.deleteUserHandler = this.deleteUserHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/users:
   *   get:
   *     summary: Ambil daftar user yang dikelola
   *     description: Mengambil daftar user berdasarkan hirarki. Super Admin melihat semua, Admin hanya melihat Operator yang mereka buat.
   *     tags: [Users]
   *     security:
   *       - apiKeyAuth: []
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Daftar user berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status: { type: string, example: success }
   *                 data:
   *                   type: object
   *                   properties:
   *                     users:
   *                       type: array
   *                       items: { $ref: '#/components/schemas/User' }
   */
  async getUsersHandler(req, res, next) {
    try {
      const users = await this._userService.getUsers(req.user.role, req.user.id);
      res.json({ status: 'success', data: { users } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/users:
   *   post:
   *     summary: Tambah Administrator atau Operator baru
   *     description: Menambahkan user baru sesuai hirarki. Admin hanya bisa menambah Operator.
   *     tags: [Users]
   *     security:
   *       - apiKeyAuth: []
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserInput'
   *     responses:
   *       201:
   *         description: User berhasil dibuat
   *       403:
   *         description: Forbidden - Hirarki tidak sesuai
   */
  async postUserHandler(req, res, next) {
    try {
      const { username, password, fullname, role } = req.body;

      // Validation logic: 
      // Admin can only create operator
      if (req.user.role === 'admin' && role !== 'operator') {
        return res.status(403).json({
          status: 'fail',
          message: 'Administrator hanya bisa menambahkan Admin Biasa (Operator)',
        });
      }

      const id = await this._userService.addUser({ 
        username, 
        password, 
        fullname, 
        role, 
        createdBy: req.user.id 
      });

      await this._logService.addLog({
        userId: req.user.id,
        action: 'CREATE_USER',
        targetId: id,
        details: { username, role }
      });

      res.status(201).json({ status: 'success', data: { userId: id } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/users/{id}:
   *   put:
   *     summary: Perbarui data User
   *     description: Memperbarui nama, password, atau role user sesuai hirarki.
   *     tags: [Users]
   *     security:
   *       - apiKeyAuth: []
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullname: { type: string, example: "Nama Baru" }
   *               password: { type: string, example: "newpassword123" }
   *               role: { type: string, enum: [admin, operator] }
   *     responses:
   *       200:
   *         description: User berhasil diperbarui
   */
  async putUserHandler(req, res, next) {
    try {
      const { id } = req.params;
      const { fullname, password, role } = req.body;

      await this._userService.updateUser(id, { fullname, password, role }, req.user.id, req.user.role);

      await this._logService.addLog({
        userId: req.user.id,
        action: 'UPDATE_USER',
        targetId: id,
        details: { fullname, role }
      });

      res.json({ status: 'success', message: 'User berhasil diperbarui' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Hapus User yang dikelola
   *     description: Menghapus user berdasarkan ID. Tidak bisa menghapus Super Admin. Admin hanya bisa menghapus bawahan mereka.
   *     tags: [Users]
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
   *         description: User berhasil dihapus
   *       403:
   *         description: Forbidden - Tidak memiliki akses atau mencoba menghapus Super Admin
   */
  async deleteUserHandler(req, res, next) {
    try {
      const targetId = req.params.id;
      
      await this._userService.deleteUser(targetId, req.user.id, req.user.role);

      await this._logService.addLog({
        userId: req.user.id,
        action: 'DELETE_USER',
        targetId,
      });

      res.json({ status: 'success', message: 'User berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersHandler;
