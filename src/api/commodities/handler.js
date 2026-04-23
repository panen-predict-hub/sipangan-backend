class CommoditiesHandler {
  constructor(service) {
    this._service = service;
    this.getCommoditiesHandler = this.getCommoditiesHandler.bind(this);
  }

  async getCommoditiesHandler(req, res, next) {
    try {
      const commodities = await this._service.getCommodities();
      res.status(200).json({
        status: 'success',
        data: commodities,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommoditiesHandler;
