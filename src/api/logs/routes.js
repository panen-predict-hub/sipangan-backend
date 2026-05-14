import express from 'express';
import authorizeRoles from '../../middleware/authorization.js';
import authMiddleware from '../../middleware/auth.js';

const routes = (handler) => {
  const router = express.Router();

  // GET /logs - Get activity logs
  router.get('/', authMiddleware, authorizeRoles('super_admin', 'admin'), handler.getLogsHandler);

  return router;
};

export default routes;
