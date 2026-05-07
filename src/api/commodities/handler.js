class CommoditiesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.getCommoditiesHandler = this.getCommoditiesHandler.bind(this);
    this.postCommodityHandler = this.postCommodityHandler.bind(this);
    this.putCommodityHandler = this.putCommodityHandler.bind(this);
    this.deleteCommodityHandler = this.deleteCommodityHandler.bind(this);
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

  async postCommodityHandler(req, res, next) {
    try {
      this._validator.validateCommodityPayload(req.body);
      const { name, unit } = req.body;
      const id = await this._service.addCommodity({ name, unit });
      res.status(201).json({
        status: 'success',
        message: 'Commodity added successfully',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async putCommodityHandler(req, res, next) {
    try {
      const { id } = req.params;
      this._validator.validateCommodityId(id);
      this._validator.validateCommodityPayload(req.body);
      await this._service.updateCommodity(id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Commodity updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommodityHandler(req, res, next) {
    try {
      const { id } = req.params;
      this._validator.validateCommodityId(id);
      await this._service.deleteCommodity(id);
      res.status(200).json({
        status: 'success',
        message: 'Commodity deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommoditiesHandler;
