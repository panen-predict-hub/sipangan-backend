import LogsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'logs',
  register: (app, { logService }) => {
    const handler = new LogsHandler(logService);
    app.use('/api/v1/logs', routes(handler));
  },
};
