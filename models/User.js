const mongoose = require('mongoose');
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Plase supply email address'
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

userSchema.virtual('gravatar').get(function () {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
})
userSchema.plugin(passportLocalMongoose,{usernameField: 'email'})
userSchema.plugin(mongodbErrorHandler,{usernameField: 'email'})

module.exports = mongoose.model('User', userSchema);