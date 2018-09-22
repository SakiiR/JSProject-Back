var mongoose = require("mongoose");

var TokenSchema = new mongoose.Schema(
  {
    value: { type: String, required: true }
  },
  { timestamps: true } // Pour avoir les dates de création et de modification automatiquement gérés par mongoose
);

mongoose.model("Token", TokenSchema);

module.exports = mongoose.model("Token");
