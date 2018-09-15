var mongoose = require('mongoose');  

var RoomSchema = new mongoose.Schema({
    id_creator: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true}
  }, 
  {timestamps: true} // Pour avoir les dates de création et de modification automatiquement gérés par mongoose
);

mongoose.model('Room', RoomSchema);

module.exports = mongoose.model('Room');