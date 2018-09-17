var mongoose = require('mongoose');  

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }, 
  {timestamps: true} // Pour avoir les dates de création et de modification automatiquement gérés par mongoose
);

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');