import Joi from 'joi';
import InvariantError from '../../utils/exceptions/InvariantError.js';

const HistoryQuerySchema = Joi.object({
  commodity: Joi.string().trim().optional(),
  region: Joi.string().trim().optional(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

const HistoryValidator = {
  validateHistoryQuery: (payload) => {
    const { error, value } = HistoryQuerySchema.validate(payload, { abortEarly: false });
    if (error) {
      throw new InvariantError(error.details.map((d) => d.message).join('; '));
    }
    return value;
  },
};

export default HistoryValidator;
