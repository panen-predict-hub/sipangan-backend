import Joi from 'joi';

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).required();

const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).required();

export { LoginPayloadSchema, RefreshTokenPayloadSchema };
