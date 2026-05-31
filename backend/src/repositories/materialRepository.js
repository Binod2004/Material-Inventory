const db = require('../db');

exports.findAll = async () => {
  const [rows] = await db.query(
    `SELECT m.material_id, m.material_name, m.category, m.quantity, m.unit_price, m.stock_status,
            s.supplier_id, s.supplier_name
     FROM materials m
     LEFT JOIN suppliers s ON m.supplier_id = s.supplier_id
     ORDER BY m.material_name`
  );
  return rows.map(row => ({
    materialId: row.material_id,
    materialName: row.material_name,
    category: row.category,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    stockStatus: row.stock_status,
    supplier: row.supplier_id ? { supplierId: row.supplier_id, supplierName: row.supplier_name } : null
  }));
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM materials WHERE material_id = ?', [id]);
  return rows[0];
};

exports.create = async (material) => {
  const { materialName, category, quantity, unitPrice, supplierId, stockStatus } = material;
  const [result] = await db.query(
    'INSERT INTO materials (material_name, category, quantity, unit_price, supplier_id, stock_status) VALUES (?,?,?,?,?,?)',
    [materialName, category, quantity, unitPrice, supplierId || null, stockStatus]
  );
  return { materialId: result.insertId, ...material };
};

exports.update = async (id, material) => {
  const { materialName, category, quantity, unitPrice, supplierId, stockStatus } = material;
  await db.query(
    'UPDATE materials SET material_name = ?, category = ?, quantity = ?, unit_price = ?, supplier_id = ?, stock_status = ? WHERE material_id = ?',
    [materialName, category, quantity, unitPrice, supplierId || null, stockStatus, id]
  );
  return { materialId: id, ...material };
};

exports.deleteById = async (id) => {
  await db.query('DELETE FROM materials WHERE material_id = ?', [id]);
};
