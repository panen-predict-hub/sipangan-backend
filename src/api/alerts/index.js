import AlertsHandler from './handler.js';
import routes from './routes.js';
import AlertsValidator from '../../validator/alerts/index.js';

const AlertsAPI = {
  name: 'alerts',
  version: '1.0.0',
  register: (app, { alertsService }) => {
    const handler = new AlertsHandler(alertsService, AlertsValidator);
    app.use('/api/v1/alerts', routes(handler));
  },
};

export default AlertsAPI;
