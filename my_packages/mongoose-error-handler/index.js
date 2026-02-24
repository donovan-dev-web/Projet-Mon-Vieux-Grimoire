// my_packages/mongoose-error-handler/index.js

module.exports = function mongooseErrorHandler(schema) {
  const hooks = ['save', 'create', 'updateOne', 'findOneAndUpdate', 'deleteOne', 'findOneAndDelete'];
  hooks.forEach(hook => schema.post(hook, handleError));
};

function handleError(error, doc, next) {
  next(formatMongooseError(error));
}

function formatMongooseError(error) {
  if (!error) return null;

  let err;

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    err = new Error(`Duplicate field "${field}"`);
    err.status = 400;
    err.code = 'DUPLICATE_FIELD';
    err.isOperational = true;
  } else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message);
    err = new Error(messages.join(', '));
    err.status = 400;
    err.code = 'VALIDATION_ERROR';
    err.isOperational = true;
  } else if (error.name === 'CastError') {
    err = new Error('Invalid ID');
    err.status = 400;
    err.code = 'INVALID_ID';
    err.isOperational = true;
  } else if (error.name === 'DocumentNotFoundError') {
    err = new Error('Resource not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    err.isOperational = true;
  } else {
    return error;
  }

  return err;
}