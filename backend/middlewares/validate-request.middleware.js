const AppError = require('../utils/app-error');

function validateRequest(schema) {
  return (req, _res, next) => {
    let data;

    if (req.body.book && typeof req.body.book === 'string') {
      try {
        data = JSON.parse(req.body.book);
      } catch {
        return next(
          new AppError('JSON du livre invalide', 400, 'INVALID_JSON')
        );
      }
    } else {
      data = req.body;
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      const formattedErrors = result.error.format();
      const errors =
        result.error?.errors?.map((e) => e.message).join(', ') ||
        'Validation échouée';
      console.log(formattedErrors);
      return next(
        new AppError(errors, 400, 'VALIDATION_ERROR', formattedErrors)
      );
    }

    req.body = result.data;
    next();
  };
}

module.exports = validateRequest;
