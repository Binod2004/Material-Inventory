const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    await dashboardController.getMetrics(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
