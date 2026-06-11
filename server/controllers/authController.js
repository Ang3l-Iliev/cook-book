const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const result = await authService.register(email, username, password);
    console.log(result);
    
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = { register, login };
