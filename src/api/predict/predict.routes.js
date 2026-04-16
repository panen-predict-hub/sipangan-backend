const express = require('express');
const router = express.Router();
const { getPrediction } = require('./predict.controller');

router.get('/', getPrediction);

module.exports = router;
