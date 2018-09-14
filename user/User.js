var mongoose = require('mongoose');  

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    status: {type: String, enum: ['pending', 'active', 'deleted'], default: 'pending', required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true}
  }, 
  {timestamps: true} // Pour avoir les dates de création et de modification automatiquement gérés par mongoose
);

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');