import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
export { app };
