class AuthHandler {
  constructor(authService, validator) {
    this._authService = authService;
    this._validator = validator;

    this.postLoginHandler = this.postLoginHandler.bind(this);
  }

  async postLoginHandler(req, res, next) {
    try {
      this._validator.validateLoginPayload(req.body);
      const { username, password } = req.body;

      const user = await this._authService.verifyUserCredential(username, password);
      const accessToken = this._authService.generateAccessToken(user);

      res.status(201).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthHandler;
