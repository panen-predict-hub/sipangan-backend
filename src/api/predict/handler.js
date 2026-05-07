class PredictHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getPredictionHandler = this.getPredictionHandler.bind(this);
  }

  async getPredictionHandler(req, res, next) {
    try {
      const { commodity, region } = this._validator.validatePredictQuery(req.query);
      const data = await this._service.getPrediction(commodity, region);
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PredictHandler;
