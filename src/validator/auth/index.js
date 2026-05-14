import { LoginPayloadSchema, RefreshTokenPayloadSchema } from './schema.js';
import InvariantError from '../../utils/exceptions/InvariantError.js';

const AuthValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRefreshTokenPayload: (payload) => {
    const validationResult = RefreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AuthValidator;
