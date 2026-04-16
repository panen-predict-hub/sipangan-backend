class PredictHandler {
  constructor(service) {
    this._service = service;

    this.getPredictionHandler = this.getPredictionHandler.bind(this);
  }

  async getPredictionHandler(req, res, next) {
    try {
      const { commodity, region } = req.query;
      const data = await this._service.getPrediction(commodity, region);
      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      if (error.message === 'AI Prediction service currently unavailable') {
        return res.status(503).json({
          status: 'error',
          message: error.message,
        });
      }
      next(error);
    }
  }
}

export default PredictHandler;
