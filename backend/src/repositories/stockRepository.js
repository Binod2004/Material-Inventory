const db = require('../db');

exports.findAll = async () => {
  const [rows] = await db.query(
    `SELECT sl.stock_id, sl.available_stock, sl.minimum_stock, sl.last_updated,
            m.material_id, m.material_name, m.category, s.supplier_id, s.supplier_name
     FROM stock_levels sl
     JOIN materials m ON sl.material_id = m.material_id
     LEFT JOIN suppliers s ON m.supplier_id = s.supplier_id
     ORDER BY sl.last_updated DESC`
  );
  return rows.map(row => ({
    stockId: row.stock_id,
    availableStock: row.available_stock,
    minimumStock: row.minimum_stock,
    lastUpdated: row.last_updated,
    material: {
      materialId: row.material_id,
      materialName: row.material_name,
      category: row.category,
      supplier: row.supplier_id ? { supplierId: row.supplier_id, supplierName: row.supplier_name } : null
    }
  }));
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM stock_levels WHERE stock_id = ?', [id]);
  return rows[0];
};

exports.create = async (stock) => {
  const { materialId, availableStock, minimumStock } = stock;
  const [result] = await db.query(
    'INSERT INTO stock_levels (material_id, available_stock, minimum_stock, last_updated) VALUES (?,?,?,NOW())',
    [materialId, availableStock, minimumStock]
  );
  return { stockId: result.insertId, ...stock };
};

exports.update = async (id, stock) => {
  const { availableStock, minimumStock } = stock;
  await db.query(
    'UPDATE stock_levels SET available_stock = ?, minimum_stock = ?, last_updated = NOW() WHERE stock_id = ?',
    [availableStock, minimumStock, id]
  );
  return { stockId: id, ...stock };
};

exports.deleteById = async (id) => {
  await db.query('DELETE FROM stock_levels WHERE stock_id = ?', [id]);
};

exports.findLowStock = async (threshold = 10) => {
  const [rows] = await db.query(
    `SELECT sl.stock_id, sl.available_stock, sl.minimum_stock, sl.last_updated,
            m.material_id, m.material_name, m.category, s.supplier_id, s.supplier_name
     FROM stock_levels sl
     JOIN materials m ON sl.material_id = m.material_id
     LEFT JOIN suppliers s ON m.supplier_id = s.supplier_id
     WHERE sl.available_stock < sl.minimum_stock
     ORDER BY sl.available_stock ASC`
  );
  return rows.map(row => ({
    stockId: row.stock_id,
    availableStock: row.available_stock,
    minimumStock: row.minimum_stock,
    lastUpdated: row.last_updated,
    material: {
      materialId: row.material_id,
      materialName: row.material_name,
      category: row.category,
      supplier: row.supplier_id ? { supplierId: row.supplier_id, supplierName: row.supplier_name } : null
    }
  }));
};
