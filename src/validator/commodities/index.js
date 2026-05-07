import Joi from 'joi';
import InvariantError from '../../utils/exceptions/InvariantError.js';

const CommodityPayloadSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  unit: Joi.string().trim().max(20).default('kg'),
}).unknown(false);

const CommoditiesValidator = {
  validateCommodityPayload: (payload) => {
    const { error, value } = CommodityPayloadSchema.validate(payload, { abortEarly: false });
    if (error) {
      throw new InvariantError(error.details.map((d) => d.message).join('; '));
    }
    return value;
  },
};

export default CommoditiesValidator;
