const supplierModel = require('../models/supplierModel');

exports.getAllSuppliers = async () => supplierModel.findAll();
exports.getSupplierById = async (id) => supplierModel.findById(id);
exports.createSupplier = async (supplier) => supplierModel.create(supplier);
exports.updateSupplier = async (id, supplier) => supplierModel.update(id, supplier);
exports.deleteSupplier = async (id) => supplierModel.deleteById(id);
