const stockModel = require('../models/stockModel');
const db = require('../config/db');

exports.getAllStock = async () => stockModel.findAll();
exports.getLowStock = async () => stockModel.findLowStock();
exports.getStockById = async (id) => stockModel.findById(id);

exports.createStock = async (stock) => {
  const created = await stockModel.create(stock);
  await db.query('UPDATE materials SET quantity = ?, stock_status = ? WHERE material_id = ?', [
    stock.availableStock,
    stock.availableStock < stock.minimumStock ? 'Low stock' : 'In stock',
    stock.materialId
  ]);
  return created;
};

exports.updateStock = async (id, stock) => {
  const updated = await stockModel.update(id, stock);
  await db.query('UPDATE materials SET quantity = ?, stock_status = ? WHERE material_id = ?', [
    stock.availableStock,
    stock.availableStock < stock.minimumStock ? 'Low stock' : 'In stock',
    stock.materialId
  ]);
  return updated;
};
exports.deleteStock = async (id) => stockModel.deleteById(id);
