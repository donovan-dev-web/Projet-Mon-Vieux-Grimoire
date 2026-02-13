// my_packages/mongoose-error-handler/index.js

module.exports = function mongooseErrorHandler(schema) {
  // Hooks post pour capturer toutes les opérations principales
  const hooks = [
    'save',
    'create',
    'updateOne',
    'findOneAndUpdate',
    'deleteOne',
    'findOneAndDelete',
  ];

  hooks.forEach((hook) => {
    schema.post(hook, handleError);
  });
};

// Fonction centrale pour gérer l’erreur
function handleError(error, doc, next) {
  next(formatMongooseError(error));
}

// Formatte les erreurs Mongoose en erreurs "opérationnelles"
function formatMongooseError(error) {
  if (!error) return null;

  let err;

  // 1️⃣ Duplication d’un champ unique
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    err = new Error(`Le champ "${field}" existe déjà.`);
    err.status = 400;
    err.code = 'DUPLICATE_FIELD';
  }
  // 2️⃣ Erreur de validation
  else if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message);
    err = new Error(messages.join(', '));
    err.status = 400;
    err.code = 'VALIDATION_ERROR';
  }
  // 3️⃣ Erreur de cast (ex: _id invalide)
  else if (error.name === 'CastError') {
    err = new Error('ID invalide.');
    err.status = 400;
    err.code = 'INVALID_ID';
  }
  // 4️⃣ Document non trouvé (pour findOneAndUpdate etc. avec {new:true})
  else if (error.name === 'DocumentNotFoundError') {
    err = new Error('Ressource non trouvée.');
    err.status = 404;
    err.code = 'NOT_FOUND';
  }
  else {
    return error;
  }

  err.isOperational = true;
  return err;
}
