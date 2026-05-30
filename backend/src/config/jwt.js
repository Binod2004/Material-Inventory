require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'change_this_jwt_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h'
};
