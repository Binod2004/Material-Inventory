const express = require('express');
const { body, validationResult } = require('express-validator');
const supplierController = require('../controllers/supplierController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    await supplierController.getAll(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await supplierController.getById(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  body('supplierName').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Supplier name is required' });
    }

    try {
      await supplierController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  body('supplierName').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Supplier name is required' });
    }

    try {
      await supplierController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    await supplierController.remove(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
