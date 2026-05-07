import Joi from 'joi';

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export { LoginPayloadSchema };
