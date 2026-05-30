const materialModel = require('../models/materialModel');

const computeStockStatus = (quantity, currentStatus) => {
  if (quantity == null) return currentStatus || 'Unknown';
  if (quantity <= 0) return 'Out of stock';
  if (quantity < 10) return 'Low stock';
  return 'In stock';
};

exports.getAllMaterials = async () => materialModel.findAll();
exports.getMaterialById = async (id) => materialModel.findById(id);
exports.createMaterial = async (material) => {
  const status = computeStockStatus(material.quantity, material.stockStatus);
  return materialModel.create({ ...material, stockStatus: status });
};
exports.updateMaterial = async (id, material) => {
  const status = computeStockStatus(material.quantity, material.stockStatus);
  return materialModel.update(id, { ...material, stockStatus: status });
};
exports.deleteMaterial = async (id) => materialModel.deleteById(id);
