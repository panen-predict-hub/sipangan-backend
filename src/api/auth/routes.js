import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.post('/login', handler.postLoginHandler);

  return router;
};

export default routes;
