/* ===== Classe d'erreur personnalisée ===== */
class AppError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status || 500;
    this.code = code || null; // Code interne précis pour identifier le type d'erreur
    this.isOperational = true; // Indique que c'est une erreur prévue et gérée, pas une erreur de programmation
  }
}

// Codes internes possibles
module.exports = {
  AppError,

  // Auth
  INVALID_CREDENTIALS: new AppError(
    'Identifiants ou mot de passe incorrect',
    401,
    'INVALID_CREDENTIALS'
  ),
  USERNAME_OR_PASSWORD_INCORRECT: new AppError(
    'Identifiant ou mot de passe incorrect',
    400,
    'USERNAME_OR_PASSWORD_INCORRECT'
  ),
  INVALID_INPUT: new AppError(
    'Données envoyées invalides',
    400,
    'INVALID_INPUT'
  ),

  // Serveur
  SERVER_ERROR: new AppError('Erreur serveur', 500, 'SERVER_ERROR'),
};
