class MapsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getRegionCoordinatesHandler = this.getRegionCoordinatesHandler.bind(this);
  }

  async getRegionCoordinatesHandler(req, res, next) {
    try {
      this._validator.validateMapsQuery(req.query);
      const coordinates = await this._service.getRegionCoordinates();
      res.status(200).json({
        status: 'success',
        data: coordinates,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default MapsHandler;
