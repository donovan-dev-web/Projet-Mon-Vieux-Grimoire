module.exports = (err, req, res, _next) => {
  // Log stack trace en dev
  if (process.env.NODE_ENV === 'development') {
    console.error('--- ERROR START ---');
    console.error(err);
    console.error('--- ERROR END ---');
  }

  if (err.isOperational) {
    return res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
    });
  }

  // Erreurs inattendues
  res.status(500).json({
    status: 500,
    code: 'UNEXPECTED_ERROR',
    message: 'Une erreur inattendue est survenue',
  });
};
