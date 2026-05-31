const dashboardService = require('../services/dashboardService');

exports.getMetrics = async (req, res, next) => {
  try {
    const metrics = await dashboardService.getMetrics();
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};
