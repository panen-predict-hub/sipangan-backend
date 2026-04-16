import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// API
import history from './api/history/index.js';
import predict from './api/predict/index.js';
import users from './api/users/index.js';

// Services
import HistoryService from './services/HistoryService.js';
import PredictService from './services/PredictService.js';
import UsersService from './services/UsersService.js';

// Middleware
import errorHandler from './middleware/error-handler.js';

const app = express();
const port = process.env.PORT || 3000;

// Initialize Services
const historyService = new HistoryService();
const predictService = new PredictService();
const usersService = new UsersService();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/history', history(historyService));
app.use('/api/predict', predict(predictService));
app.use('/api/users', users(usersService));

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Centralized Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SIPANGAN Backend listening at http://localhost:${port}`);
});
