import mongoose, { Schema, mongo } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reciever: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,

  }
}, {timestamps:true});

export const Message = mongoose.model("Message", messageSchema)