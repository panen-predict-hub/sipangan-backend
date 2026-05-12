class HistoryHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getHistoryHandler = this.getHistoryHandler.bind(this);
    this.getOverviewHandler = this.getOverviewHandler.bind(this);
    this.postPriceHandler = this.postPriceHandler.bind(this);
    this.putPriceHandler = this.putPriceHandler.bind(this);
    this.deletePriceHandler = this.deletePriceHandler.bind(this);
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

  async postPriceHandler(req, res, next) {
    try {
      const validatedPayload = this._validator.validatePricePayload(req.body);
      const priceId = await this._service.addPrice(validatedPayload);

      res.status(201).json({
        status: 'success',
        message: 'Data harga berhasil ditambahkan',
        data: {
          priceId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putPriceHandler(req, res, next) {
    try {
      const { id } = req.params;
      const validatedPayload = this._validator.validatePricePayload(req.body);
      await this._service.updatePrice(id, validatedPayload);

      res.status(200).json({
        status: 'success',
        message: 'Data harga berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePriceHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deletePrice(id);

      res.status(200).json({
        status: 'success',
        message: 'Data harga berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default HistoryHandler;