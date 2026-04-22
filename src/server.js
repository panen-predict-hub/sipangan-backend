import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// APIs
import HistoryAPI from './api/history/index.js';
import PredictAPI from './api/predict/index.js';
import UsersAPI from './api/users/index.js';
import AlertsAPI from './api/alerts/index.js';
import MapsAPI from './api/maps/index.js';

// Services
import HistoryService from './services/HistoryService.js';
import PredictService from './services/PredictService.js';
import UsersService from './services/UsersService.js';
import AlertsService from './services/AlertsService.js';
import MapsService from './services/MapsService.js';

// Middleware
import errorHandler from './middleware/error-handler.js';
import landingTemplate from './utils/landing-template.js';

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
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Initialize Services
const historyService = new HistoryService();
const predictService = new PredictService();
const usersService = new UsersService();
const alertsService = new AlertsService();
const mapsService = new MapsService();

// Register API Routes (consistent plugin pattern)
HistoryAPI.register(app, { historyService });
PredictAPI.register(app, { predictService });
UsersAPI.register(app, { usersService });
AlertsAPI.register(app, { alertsService });
MapsAPI.register(app, { mapsService });

// Default Landing Page (API Repository)
app.get('/', (req, res) => {
  res.send(landingTemplate);
});

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// buatkan supaya bisa menjalankan seed.js di migration

app.get('/seed', async (req, res) => {
  try {
    await seed();
    res.send('Seed executed');
  } catch (error) {
    res.status(500).send('Seed failed');
  }
});

// Centralized Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SIPANGAN Backend listening at http://localhost:${port}`);
});

