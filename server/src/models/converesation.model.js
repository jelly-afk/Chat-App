import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },
  ],
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
