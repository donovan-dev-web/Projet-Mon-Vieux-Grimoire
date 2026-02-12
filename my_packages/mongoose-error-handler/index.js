module.exports = function mongooseErrorHandler(schema) {

  schema.post('save', handleError);
  schema.post('create', handleError);
  schema.post('updateOne', handleError);
  schema.post('findOneAndUpdate', handleError);
  schema.post('deleteOne', handleError);
  schema.post('findOneAndDelete', handleError);

};

function handleError(error, doc, next) {
  next(formatMongooseError(error));
}

function formatMongooseError(error) {

  if (!error) return null;

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const err = new Error(`Le champ "${field}" existe déjà.`);
    err.status = 400;
    return err;
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors)
      .map(e => e.message);

    const err = new Error(messages.join(", "));
    err.status = 400;
    return err;
  }

  if (error.name === "CastError") {
    const err = new Error("ID invalide.");
    err.status = 400;
    return err;
  }

  if (error.name === "DocumentNotFoundError") {
    const err = new Error("Ressource non trouvée.");
    err.status = 404;
    return err;
  }

  return error;
}
