/* Logique metier Connexion et inscription des utilisateurs */

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModles = require('../Models/UsersModels');

exports.signup = async (req, res) => {
  try {
    const haschedPassword = await argon2.hash(req.body.password, {
      type: argon2.argon2id /* Variante hybride recommandation officielle RFC 9106 */,
      memoryCost: 131072 /* 128 Mo recommandation 2026 */,
      timeCost: 2 /* 2 Standard moderne */,
      parallelism: 4 /* 4 Nombres de coeurs logique (thread utiliser) standard recommander 2026 */,
    });

    const user = new UserModles({
      email: req.body.email,
      password: haschedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'Utilisateur créée avec succès' });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await UserModles.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Identifiants ou Mots de passe incorrect' });
    }

    const valid = await argon2.verify(user.password, req.body.password);

    if (!valid) {
      return res
        .status(401)
        .json({ message: 'Identifiants ou Mots de passe incorrect' });
    }

    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || error });
  }
};
