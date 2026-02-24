const userService = require('../services/user.service');

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.signupUser(email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
