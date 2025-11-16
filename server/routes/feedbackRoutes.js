const express = require('express');
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackCntrl');

const router = express.Router();

// POST /api/feedback - Submit feedback
router.post('/', submitFeedback);

// GET /api/feedback - Get all feedback (for admin)
router.get('/', getAllFeedback);

module.exports = router;