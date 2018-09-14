var mongoose = require('mongoose');  

var MessageSchema = new mongoose.Schema({
    id_sender: {type: Number, required: true},
    id_room: {type: Number, required: true},
    status: {type: String, enum: ['pending', 'active', 'deleted'], default: 'pending'},
    content: {type: String, required: true}
  }, 
  {timestamps: true}
);

mongoose.model('Message', MessageSchema);

module.exports = mongoose.model('Message');