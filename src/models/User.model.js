const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
  // Define your user schema here
});

const User = mongoose.model('User', userSchema);

module.exports = User;
