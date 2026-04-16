class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      res.status(201).json({ status: 'success', message: 'User added' });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersHandler;
