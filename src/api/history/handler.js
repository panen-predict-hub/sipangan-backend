class HistoryHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getHistoryHandler = this.getHistoryHandler.bind(this);
    this.getOverviewHandler = this.getOverviewHandler.bind(this);
  }

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

  async getOverviewHandler(req, res, next) {
    try {
      const overview = await this._service.getOverview();
      res.status(200).json({
        status: 'success',
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default HistoryHandler;