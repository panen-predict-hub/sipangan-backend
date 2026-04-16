const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');

router.get('/', historyController.getHistory);
router.get('/overview', historyController.getOverview);

module.exports = router;
