import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// APIs
import HistoryAPI from './api/history/index.js';
import PredictAPI from './api/predict/index.js';
import AlertsAPI from './api/alerts/index.js';
import MapsAPI from './api/maps/index.js';
import CommoditiesAPI from './api/commodities/index.js';
import AuthAPI from './api/auth/index.js';

// Services
import HistoryService from './services/HistoryService.js';
import PredictService from './services/PredictService.js';
import AlertsService from './services/AlertsService.js';
import MapsService from './services/MapsService.js';
import CommoditiesService from './services/CommoditiesService.js';
import UserService from './services/UserService.js';
import AuthService from './services/AuthService.js';

// Validators
import AuthValidator from './validator/auth/index.js';

// Middleware
import errorHandler from './middleware/error-handler.js';
import apiKeyMiddleware from './middleware/api-key.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const swaggerAuth = (req, res, next) => {
  const auth = { login: process.env.SWAGGER_USER || 'admin', password: process.env.SWAGGER_PASSWORD || 'admin123' };
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login && password && login === auth.login && password === auth.password) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="401"');
  res.status(401).send('Authentication required.');
};

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));
app.use(express.json());

// Apply API Key Middleware to all routes except health check, root, and swagger
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/health' || req.path.startsWith('/api-docs')) {
    return next();
  }
  apiKeyMiddleware(req, res, next);
});

// Swagger Documentation Route (Protected with Basic Auth)
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'SIPANGAN API Documentation',
}));

// Initialize Services
const historyService = new HistoryService();
const predictService = new PredictService();
const alertsService = new AlertsService();
const mapsService = new MapsService();
const commoditiesService = new CommoditiesService();
const userService = new UserService();
const authService = new AuthService(userService);

// Register API Routes (consistent plugin pattern)
HistoryAPI.register(app, { historyService });
PredictAPI.register(app, { predictService });
AlertsAPI.register(app, { alertsService });
MapsAPI.register(app, { mapsService });
CommoditiesAPI.register(app, { commoditiesService });
AuthAPI.register(app, { authService, validator: AuthValidator });

// Default Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'SIPANGAN API is running',
  });
});

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Centralized Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SIPANGAN Backend listening at http://localhost:${port}`);
});

