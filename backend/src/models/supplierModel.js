const db = require('../config/db');

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM suppliers ORDER BY supplier_name');
  return rows.map(row => ({
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    phone: row.phone,
    email: row.email,
    address: row.address
  }));
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id]);
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    phone: row.phone,
    email: row.email,
    address: row.address
  };
};

exports.create = async (supplier) => {
  const { supplierName, phone, email, address } = supplier;
  const [result] = await db.query(
    'INSERT INTO suppliers (supplier_name, phone, email, address) VALUES (?,?,?,?)',
    [supplierName, phone, email, address]
  );
  return { supplierId: result.insertId, ...supplier };
};

exports.update = async (id, supplier) => {
  const { supplierName, phone, email, address } = supplier;
  await db.query(
    'UPDATE suppliers SET supplier_name = ?, phone = ?, email = ?, address = ? WHERE supplier_id = ?',
    [supplierName, phone, email, address, id]
  );
  return { supplierId: Number(id), ...supplier };
};

exports.deleteById = async (id) => {
  await db.query('DELETE FROM suppliers WHERE supplier_id = ?', [id]);
};
