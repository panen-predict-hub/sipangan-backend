import AuthHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'auth',
  register: (app, { authService, validator }) => {
    const handler = new AuthHandler(authService, validator);
    app.use('/api/v1/auth', routes(handler));
  },
};
