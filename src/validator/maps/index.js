import Joi from 'joi';
import InvariantError from '../../utils/exceptions/InvariantError.js';

const MapsQuerySchema = Joi.object({
  region: Joi.string().trim().optional(),
});

const MapsValidator = {
  validateMapsQuery: (payload) => {
    const { error, value } = MapsQuerySchema.validate(payload, { abortEarly: false });
    if (error) {
      throw new InvariantError(error.details.map((d) => d.message).join('; '));
    }
    return value;
  },
};

export default MapsValidator;
