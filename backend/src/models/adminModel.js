const db = require('../config/db');

exports.findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
  return rows[0];
};

exports.updatePassword = async (id, hashedPassword) => {
  await db.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, id]);
};
