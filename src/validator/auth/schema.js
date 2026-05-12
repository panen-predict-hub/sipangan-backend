import Joi from 'joi';

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export { LoginPayloadSchema, RefreshTokenPayloadSchema };
