const stockService = require('../services/stockService');

exports.getAll = async (req, res, next) => {
  try {
    const stock = await stockService.getAllStock();
    res.json(stock);
  } catch (error) {
    next(error);
  }
};

exports.getLow = async (req, res, next) => {
  try {
    const stock = await stockService.getLowStock();
    res.json(stock);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const payload = {
      materialId: Number(req.body.materialId || req.body.material?.materialId),
      availableStock: Number(req.body.availableStock),
      minimumStock: Number(req.body.minimumStock)
    };
    const created = await stockService.createStock(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const payload = {
      materialId: Number(req.body.materialId || req.body.material?.materialId),
      availableStock: Number(req.body.availableStock),
      minimumStock: Number(req.body.minimumStock)
    };
    const updated = await stockService.updateStock(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await stockService.deleteStock(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
