const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      await authController.login(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
