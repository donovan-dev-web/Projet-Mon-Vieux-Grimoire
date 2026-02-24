const mongoose = require('mongoose');
const mongooseErrorHandler = require('mongoose-error-handler');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseErrorHandler);

module.exports = mongoose.model('User', userSchema);
