import PredictHandler from './handler.js';
import routes from './routes.js';

const predict = (service) => {
  const handler = new PredictHandler(service);
  return routes(handler);
};

export default predict;
