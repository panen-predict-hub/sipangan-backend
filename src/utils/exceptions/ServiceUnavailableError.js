import ClientError from './ClientError.js';

class ServiceUnavailableError extends ClientError {
  constructor(message) {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
  }
}

export default ServiceUnavailableError;
