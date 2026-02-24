const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const AppError = require('../utils/app-error');
const jwtConfig = require('../config/jwt.config');

async function signupUser(email, password) {
  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400, 'INVALID_INPUT');
  }

  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 131072,
    timeCost: 2,
    parallelism: 4,
  });

  const user = new userModel({ email, password: hashedPassword });
  await user.save();

  return { message: 'Utilisateur créé avec succès' };
}

async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400, 'INVALID_INPUT');
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError(
      'Email ou mot de passe invalide',
      401,
      'INVALID_CREDENTIALS'
    );
  }

  const valid = await argon2.verify(user.password, password);

  if (!valid) {
    throw new AppError(
      'Email ou mot de passe invalide',
      401,
      'INVALID_CREDENTIALS'
    );
  }

  const token = jwt.sign({ userId: user._id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  return { userId: user._id, token };
}

module.exports = {
  signupUser,
  loginUser,
};
