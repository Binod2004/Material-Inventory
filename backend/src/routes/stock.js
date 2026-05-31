const express = require('express');
const { body, validationResult } = require('express-validator');
const stockController = require('../controllers/stockController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    await stockController.getAll(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/low', async (req, res, next) => {
  try {
    await stockController.getLow(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  body('materialId').isInt({ min: 1 }),
  body('availableStock').isInt({ min: 0 }),
  body('minimumStock').isInt({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Material id, available stock, and minimum stock are required' });
    }

    try {
      await stockController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  body('materialId').isInt({ min: 1 }),
  body('availableStock').isInt({ min: 0 }),
  body('minimumStock').isInt({ min: 0 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Material id, available stock, and minimum stock are required' });
    }

    try {
      await stockController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    await stockController.remove(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
