import UsersHandler from './handler.js';
import routes from './routes.js';

const users = (service, validator) => {
  const handler = new UsersHandler(service, validator);
  return routes(handler);
};

export default users;
