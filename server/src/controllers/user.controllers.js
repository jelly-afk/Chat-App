import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const options = {
  httpOnly: true,
  secure: true,
};
const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    console.log("user not found");
    return;
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const userRegister = asyncHandler(async (req, res) => {
  const { username, fullName, password, email, gender } = req.body;
  if (
    [username, fullName, email, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }
  const usernameUsed = await User.findOne({
    username: username.toLowerCase(),
  });
  if (usernameUsed) {
    throw new ApiError(409, "username already used");
  }
  const emailUsed = await User.findOne({
    email,
  });
  if (emailUsed) {
    throw new ApiError(409, "email already exists");
  }
  const boyAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;
  const avatar = gender === "male" ? boyAvatar : girlAvatar;
  const user = await User.create({
    username,
    email,
    password,
    gender,
    fullName,
    avatar,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken } = await generateAccessAndRefreshToken(user._id);
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, createdUser, "user created succesfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "username or email required");
  }
  const user = await User.findOne({
    $or: [
      { username: username?.toLowerCase() },
      {
        email: email?.toLowerCase(),
      },
    ],
  });
  if (!user) {
    throw new ApiError(404, "user does not exists");
  }
  const passwordCheck = await user.isPasswordCorrect(password);
  if (!passwordCheck) {
    throw new ApiError(401, "incorrect password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "user logged in succesfully"));
});

const userLogout = asyncHandler(async (res, req) => {
  const userId = req.body?.user?._id;
  if (!userId) {
    throw new ApiError(401, "unauthrized access");
  }
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

export { userRegister, userLogin, userLogout };
