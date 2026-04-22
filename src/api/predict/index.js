import PredictHandler from './handler.js';
import routes from './routes.js';
import PredictValidator from '../../validator/predict/index.js';

const PredictAPI = {
  name: 'predictions',
  version: '1.0.0',
  register: (app, { predictService }) => {
    const handler = new PredictHandler(predictService, PredictValidator);
    app.use('/api/v1/predictions', routes(handler));
  },
};

export default PredictAPI;

