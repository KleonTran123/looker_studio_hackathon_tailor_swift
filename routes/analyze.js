const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController.js');

router.get('/', analysisController.handleAnalyzeRequest);

module.exports = router;
