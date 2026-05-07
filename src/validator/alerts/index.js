import Joi from 'joi';
import InvariantError from '../../utils/exceptions/InvariantError.js';

const AlertsQuerySchema = Joi.object({
  regionId: Joi.string().uuid().optional(),
  commodityId: Joi.string().uuid().optional(),
  priceThreshold: Joi.number().precision(2).optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
}).unknown(false);

const AlertsValidator = {
  validateAlertsQuery: (payload) => {
    const { error, value } = AlertsQuerySchema.validate(payload, { abortEarly: false });
    if (error) {
      throw new InvariantError(error.details.map((d) => d.message).join('; '));
    }
    return value;
  },
};

export default AlertsValidator;
