import UsersHandler from './handler.js';
import routes from './routes.js';
import UsersValidator from '../../validator/users/index.js';

const UsersAPI = {
  name: 'users',
  version: '1.0.0',
  register: (app, { usersService }) => {
    const handler = new UsersHandler(usersService, UsersValidator);
    app.use('/api/v1/users', routes(handler));
  },
};

export default UsersAPI;

