const express = require('express');
const router = express.Router();
const surveyController = require('./controllers/survey.controller')

const { protect } = require('../../middleware/auth.middleware');

// GET /api/survey - Get aggregated surveys from all providers
router.get('/', protect, surveyController.getSurveys);

// GET /api/survey/:provider/:surveyId/initiate - Initiate survey entry
router.get('/:provider/:surveyId/initiate', protect, surveyController.initiateSurvey);

// Callbacks (Unprotected as they come from provider servers/redirects)
const trackingController = require('./controllers/tracking.controller');
router.get('/callback/goweb', trackingController.handleGoWebCallback);
router.get('/callback/zamplia', trackingController.handleZampliaCallback);

module.exports = router;
