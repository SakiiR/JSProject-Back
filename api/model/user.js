const mongoose = require('mongoose'); // Import de la librairie mongoose


// Définition du schéma
var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    status: {type: String, enum: ['pending', 'active', 'deleted'], default: 'pending', required: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
  }, 
  {timestamps: true} // Pour avoir les dates de création et de modification automatiquement gérés par mongoose
);

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User'); // Export du schéma