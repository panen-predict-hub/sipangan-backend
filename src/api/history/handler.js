class HistoryHandler {
  constructor(service) {
    this._service = service;

    this.getHistoryHandler = this.getHistoryHandler.bind(this);
    this.getOverviewHandler = this.getOverviewHandler.bind(this);
  }

  async getHistoryHandler(req, res, next) {
    try {
      const history = await this._service.getHistory(req.query);
      res.status(200).json({
        status: 'success',
        data: history,
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