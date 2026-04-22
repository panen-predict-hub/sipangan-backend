class AlertsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getAlertsHandler = this.getAlertsHandler.bind(this);
  }

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
