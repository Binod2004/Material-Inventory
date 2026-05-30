const bcrypt = require('bcryptjs');
const adminModel = require('../models/adminModel');

exports.login = async ({ username, password }) => {
  const admin = await adminModel.findByUsername(username);
  if (!admin) {
    const error = new Error('Invalid username or password');
    error.status = 401;
    throw error;
  }

  const isHashedPassword = typeof admin.password === 'string' && admin.password.startsWith('$2');
  const validPassword = isHashedPassword
    ? await bcrypt.compare(password, admin.password)
    : password === admin.password;

  if (!validPassword) {
    const error = new Error('Invalid username or password');
    error.status = 401;
    throw error;
  }

  if (!isHashedPassword) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await adminModel.updatePassword(admin.id, hashedPassword);
  }

  return { id: admin.id, username: admin.username };
};
