import { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(userLogout);

export default userRouter;
