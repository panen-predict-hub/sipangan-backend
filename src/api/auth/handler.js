/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: user_sipangan
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Login successful
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             refreshToken:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             role:
 *               type: string
 *               enum: [super_admin, admin, operator]
 *               example: super_admin
 *     RefreshRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

class AuthHandler {
  constructor(authService, validator) {
    this._authService = authService;
    this._validator = validator;

    this.postLoginHandler = this.postLoginHandler.bind(this);
    this.putRefreshTokenHandler = this.putRefreshTokenHandler.bind(this);
    this.deleteRefreshTokenHandler = this.deleteRefreshTokenHandler.bind(this);
  }

  /**
   * @openapi
   * /api/v1/auth/login:
   *   post:
   *     summary: Login User
   *     description: Masuk ke sistem untuk mendapatkan Access Token dan Refresh Token.
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       201:
   *         description: Login Berhasil
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Input tidak valid
   *       401:
   *         description: Username atau password salah
   */
  async postLoginHandler(req, res, next) {
    try {
      this._validator.validateLoginPayload(req.body);
      const { username, password } = req.body;

      const user = await this._authService.verifyUserCredential(username, password);
      const accessToken = this._authService.generateAccessToken(user);
      const refreshToken = this._authService.generateRefreshToken(user);

      await this._authService.addRefreshToken(refreshToken);

      res.status(201).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/auth/refresh:
   *   put:
   *     summary: Perbarui Access Token
   *     description: Gunakan Refresh Token untuk mendapatkan Access Token baru tanpa harus login ulang.
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshRequest'
   *     responses:
   *       200:
   *         description: Token berhasil diperbarui
   *       400:
   *         description: Refresh token tidak valid
   */
  async putRefreshTokenHandler(req, res, next) {
    try {
      this._validator.validateRefreshTokenPayload(req.body);
      const { refreshToken } = req.body;

      const { id, username, role } = await this._authService.verifyRefreshToken(refreshToken);
      const accessToken = this._authService.generateAccessToken({ id, username, role });

      res.status(200).json({
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/auth/logout:
   *   delete:
   *     summary: Logout User
   *     description: Menghapus Refresh Token dari server untuk mengakhiri sesi.
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshRequest'
   *     responses:
   *       200:
   *         description: Logout berhasil
   *       400:
   *         description: Refresh token tidak ditemukan
   */
  async deleteRefreshTokenHandler(req, res, next) {
    try {
      this._validator.validateRefreshTokenPayload(req.body);
      const { refreshToken } = req.body;

      await this._authService.verifyRefreshToken(refreshToken);
      await this._authService.deleteRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus (Logout berhasil)',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthHandler;
