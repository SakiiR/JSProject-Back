import mongoose from "mongoose";

const { Schema } = mongoose;

const roomSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  private: {
    type: Boolean,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

exports = mongoose.model("Room", roomSchema);
