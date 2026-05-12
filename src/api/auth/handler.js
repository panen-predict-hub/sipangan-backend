class AuthHandler {
  constructor(authService, validator) {
    this._authService = authService;
    this._validator = validator;

    this.postLoginHandler = this.postLoginHandler.bind(this);
    this.putRefreshTokenHandler = this.putRefreshTokenHandler.bind(this);
    this.deleteRefreshTokenHandler = this.deleteRefreshTokenHandler.bind(this);
  }

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
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putRefreshTokenHandler(req, res, next) {
    try {
      this._validator.validateRefreshTokenPayload(req.body);
      const { refreshToken } = req.body;

      const { id, username } = await this._authService.verifyRefreshToken(refreshToken);
      const accessToken = this._authService.generateAccessToken({ id, username });

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
