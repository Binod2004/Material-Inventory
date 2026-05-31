const db = require('../db');

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM suppliers ORDER BY supplier_name');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id]);
  return rows[0];
};

exports.create = async (supplier) => {
  const { supplierName, phone, email, address } = supplier;
  const [result] = await db.query(
    'INSERT INTO suppliers (supplier_name, phone, email, address) VALUES (?,?,?,?)',
    [supplierName, phone, email, address]
  );
  return { supplier_id: result.insertId, ...supplier };
};

exports.update = async (id, supplier) => {
  const { supplierName, phone, email, address } = supplier;
  await db.query(
    'UPDATE suppliers SET supplier_name = ?, phone = ?, email = ?, address = ? WHERE supplier_id = ?',
    [supplierName, phone, email, address, id]
  );
  return { supplier_id: id, ...supplier };
};

exports.deleteById = async (id) => {
  await db.query('DELETE FROM suppliers WHERE supplier_id = ?', [id]);
};
