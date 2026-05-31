const materialModel = require('../models/materialModel');
const supplierModel = require('../models/supplierModel');
const stockModel = require('../models/stockModel');

exports.getMetrics = async () => {
  const [materials, suppliers, stockLevels] = await Promise.all([
    materialModel.findAll(),
    supplierModel.findAll(),
    stockModel.findAll()
  ]);

  const lowStockItems = stockLevels.filter(item => item.availableStock < item.minimumStock).length;
  const availableStock = stockLevels.reduce((total, item) => total + (item.availableStock || 0), 0);

  return {
    totalMaterials: materials.length,
    totalSuppliers: suppliers.length,
    lowStockItems,
    availableStock
  };
};
