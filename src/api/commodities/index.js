import CommoditiesHandler from './handler.js';
import routes from './routes.js';

const CommoditiesAPI = {
  name: 'commodities',
  version: '1.0.0',
  register: (app, { commoditiesService }) => {
    const handler = new CommoditiesHandler(commoditiesService);
    app.use('/api/v1/commodities', routes(handler));
  },
};

export default CommoditiesAPI;
