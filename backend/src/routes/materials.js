const express = require('express');
const { body, validationResult } = require('express-validator');
const materialController = require('../controllers/materialController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    await materialController.getAll(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await materialController.getById(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  body('materialName').notEmpty(),
  body('quantity').isInt({ min: 0 }),
  body('unitPrice').isFloat({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Material name, quantity, and unit price are required' });
    }

    try {
      await materialController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  body('materialName').notEmpty(),
  body('quantity').isInt({ min: 0 }),
  body('unitPrice').isFloat({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Material name, quantity, and unit price are required' });
    }

    try {
      await materialController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    await materialController.remove(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
