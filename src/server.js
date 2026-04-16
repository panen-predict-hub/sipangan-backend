const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');
const historyRoutes = require('./api/history/history.routes');
const predictRoutes = require('./api/predict/predict.routes');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/history', historyRoutes);
app.use('/api/predict', predictRoutes);


// Basic Health Check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'OK', database: 'Connected' });
  } catch (err) {
    res.status(500).json({ status: 'Error', database: 'Disconnected', error: err.message });
  }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(port, () => {
  console.log(`SIPANGAN Backend listening at http://localhost:${port}`);
});
