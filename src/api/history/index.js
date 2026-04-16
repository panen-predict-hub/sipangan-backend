import HistoryHandler from './handler.js';
import routes from './routes.js';

const history = (service) => {
  const handler = new HistoryHandler(service);
  return routes(handler);
};

export default history;
