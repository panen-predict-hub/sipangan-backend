import HistoryHandler from './handler.js';
import routes from './routes.js';
import HistoryValidator from '../../validator/history/index.js';

const HistoryAPI = {
  name: 'history',
  version: '1.0.0',
  register: (app, { historyService }) => {
    const handler = new HistoryHandler(historyService, HistoryValidator);
    app.use('/api/v1/history', routes(handler));
  },
};

export default HistoryAPI;

