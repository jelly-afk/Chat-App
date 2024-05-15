import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const jwtVerify = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!userId) {
      throw new ApiError(401, "anauthorized access");
    }
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "invalid token");
    }
    
    req.body.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token" });
  }
};

export default jwtVerify;
