import WeatherHandler from './handler.js';
import routes from './routes.js';

const WeatherAPI = {
  name: 'weather',
  version: '1.0.0',
  register: (app, { weatherService }) => {
    const handler = new WeatherHandler(weatherService);
    app.use('/api/v1/weather', routes(handler));
  },
};

export default WeatherAPI;
