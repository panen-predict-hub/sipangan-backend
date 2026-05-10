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
import { pool } from './config/database.js';
import redisClient from './config/redis.js';

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

// Apply API Key Middleware to all routes except health check and root
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/health') {
    return next();
  }
  apiKeyMiddleware(req, res, next);
});

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

// Advanced Health Check
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'UNKNOWN',
      redis: 'UNKNOWN'
    }
  };

  // Check Database
  try {
    await pool.query('SELECT 1');
    healthStatus.services.database = 'CONNECTED';
  } catch (err) {
    healthStatus.status = 'ERROR';
    healthStatus.services.database = `DISCONNECTED: ${err.message}`;
  }

  // Check Redis
  try {
    if (redisClient.isOpen) {
      await redisClient.ping();
      healthStatus.services.redis = 'CONNECTED';
    } else {
      healthStatus.status = 'ERROR';
      healthStatus.services.redis = 'DISCONNECTED';
    }
  } catch (err) {
    healthStatus.status = 'ERROR';
    healthStatus.services.redis = `DISCONNECTED: ${err.message}`;
  }

  const statusCode = healthStatus.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// Centralized Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SIPANGAN Backend listening at http://localhost:${port}`);
});
