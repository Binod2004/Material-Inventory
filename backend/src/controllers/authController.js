const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const { secret, expiresIn } = require('../config/jwt');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login({ username, password });
    const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    next(error);
  }
};
