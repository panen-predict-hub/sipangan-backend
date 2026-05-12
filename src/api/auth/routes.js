import express from 'express';
import { loginRateLimiter } from '../../middleware/rate-limit.js';

const routes = (handler) => {
  const router = express.Router();

  router.post('/login', loginRateLimiter, handler.postLoginHandler);
  router.put('/refresh', handler.putRefreshTokenHandler);
  router.delete('/logout', handler.deleteRefreshTokenHandler);

  return router;
};

export default routes;
