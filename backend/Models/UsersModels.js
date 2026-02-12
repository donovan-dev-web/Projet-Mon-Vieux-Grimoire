const mongoose = require('mongoose');
const mongooseErrorHandler = require('mongoose-error-handler');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(mongooseErrorHandler);

module.exports = mongoose.model('User', userSchema);
