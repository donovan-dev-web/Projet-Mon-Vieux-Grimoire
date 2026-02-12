const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModles = require('../Models/UsersModels');
const errors = require('../utils/errors');

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(errors.INVALID_INPUT);

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 131072,
      timeCost: 2,
      parallelism: 4,
    });

    const user = new UserModles({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    next(errors.SERVER_ERROR);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(errors.INVALID_INPUT);

    const user = await UserModles.findOne({ email });
    if (!user) return next(errors.INVALID_CREDENTIALS);

    const valid = await argon2.verify(user.password, password);
    if (!valid) return next(errors.INVALID_CREDENTIALS);

    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      }),
    });
  } catch (err) {
    console.error(err);
    next(errors.SERVER_ERROR);
  }
};
