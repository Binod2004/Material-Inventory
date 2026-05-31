const supplierService = require('../services/supplierService');

exports.getAll = async (req, res, next) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const created = await supplierService.createSupplier(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await supplierService.updateSupplier(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
