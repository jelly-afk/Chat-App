import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.route("/send/:id").post(jwtVerify, sendMessage);
messageRouter.route("/get-chat/:id").get(jwtVerify, getMessages);

export default messageRouter;
