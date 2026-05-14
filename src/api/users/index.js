import UsersHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'users',
  register: (app, { userService, logService }) => {
    const handler = new UsersHandler(userService, logService);
    app.use('/api/v1/users', routes(handler));
  },
};
