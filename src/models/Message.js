import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
