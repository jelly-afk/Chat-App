import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controllers.js";
import jwtVerify from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(jwtVerify, userLogout);
userRouter.route("/get-all").get(jwtVerify, getAllUsers);
export default userRouter;
