import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/converesation.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { _id: sender } = req.body.user;
  const reciever = req.params.id;
  const message = req.body.message;
  console.log(reciever);
  if (!(sender && reciever)) {
    throw new ApiError(400, "senderId and recieverId are required");
  }
  const newMessage = await Message.create({
    sender,
    reciever,
    message,
  });
  let conversation = await Conversation.findOne({
    participants: {
      $all: [sender, reciever],
    },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [sender, reciever],
    });
  }
  conversation.messages.push(newMessage._id);
  await conversation.save();

  res
    .status(200)
    .json(new ApiResponse(200, newMessage, "message sent successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.body.user._id;
  const { id: userToChatWithId } = req.params;
  const converesation = await Conversation.findOne({
    participants: { $all: [userToChatWithId, currentUserId] },
  }).populate("messages");

  console.log(converesation.messages);
  res
    .status(200)
    .json(
      new ApiResponse(200, converesation.messages, "chat fetched successfully")
    );
});

export { sendMessage, getMessages };
