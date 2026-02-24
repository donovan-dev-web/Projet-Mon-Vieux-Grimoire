module.exports = (err, req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || 'UNEXPECTED_ERROR';

  if (process.env.NODE_ENV === 'development') {
    console.error('--- ERROR START ---');
    console.error(err);
    console.error('--- ERROR END ---');
  }

  res.status(status).json({
    status,
    code,
    message: err.isOperational
      ? err.message
      : 'Une erreur inattendue est survenue',
  });
};
