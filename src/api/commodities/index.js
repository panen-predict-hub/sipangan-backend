import CommoditiesHandler from './handler.js';
import routes from './routes.js';
import CommoditiesValidator from '../../validator/commodities/index.js';

const CommoditiesAPI = {
  name: 'commodities',
  version: '1.0.0',
  register: (app, { commoditiesService }) => {
    const handler = new CommoditiesHandler(commoditiesService, CommoditiesValidator);
    app.use('/api/v1/commodities', routes(handler));
  },
};

export default CommoditiesAPI;
