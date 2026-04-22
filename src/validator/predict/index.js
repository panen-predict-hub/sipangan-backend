import Joi from 'joi';
import InvariantError from '../../utils/exceptions/InvariantError.js';

const PredictQuerySchema = Joi.object({
  commodity: Joi.string().trim().required(),
  region: Joi.string().trim().required(),
});

const PredictValidator = {
  validatePredictQuery: (payload) => {
    const { error } = PredictQuerySchema.validate(payload, { abortEarly: false });
    if (error) {
      throw new InvariantError(error.details.map((d) => d.message).join('; '));
    }
  },
};

export default PredictValidator;
