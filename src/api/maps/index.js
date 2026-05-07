import MapsHandler from './handler.js';
import routes from './routes.js';
import MapsValidator from '../../validator/maps/index.js';

const MapsAPI = {
  name: 'maps',
  version: '1.0.0',
  register: (app, { mapsService }) => {
    const handler = new MapsHandler(mapsService, MapsValidator);
    app.use('/api/v1/maps', routes(handler));
  },
};

export default MapsAPI;
