import express from 'express';
import authorizeRoles from '../../middleware/authorization.js';
import authMiddleware from '../../middleware/auth.js';

const routes = (handler) => {
  const router = express.Router();

  // GET /users - Get all users managed by requester
  router.get('/', authMiddleware, authorizeRoles('super_admin', 'admin'), handler.getUsersHandler);

  // POST /users - Create new admin/operator
  router.post('/', authMiddleware, authorizeRoles('super_admin', 'admin'), handler.postUserHandler);

  // PUT /users/:id - Update managed user
  router.put('/:id', authMiddleware, authorizeRoles('super_admin', 'admin'), handler.putUserHandler);

  // DELETE /users/:id - Delete managed user
  router.delete('/:id', authMiddleware, authorizeRoles('super_admin', 'admin'), handler.deleteUserHandler);

  return router;
};

export default routes;
