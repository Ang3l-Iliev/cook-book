const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const result = await authService.register(email, username, password);

    res.status(201).json(result);
  } catch (err) {
    next(err)
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err)
  }
};
module.exports = { register, login };
