import express from 'express';
import { loginRateLimiter } from '../../middleware/rate-limit.js';

const routes = (handler) => {
  const router = express.Router();

  router.post('/login', loginRateLimiter, handler.postLoginHandler);

  return router;
};

export default routes;
