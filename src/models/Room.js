import mongoose from "mongoose";

const { Schema } = mongoose;

const roomSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
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
    required: false
  },
  salt: {
    type: String,
    required: false
  }
});

export default mongoose.model("Room", roomSchema);
