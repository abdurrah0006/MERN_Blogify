import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AVATARS, DEFAULT_AVATAR } from "../config/avatars.js";
import { HttpError } from "../utils/http.js";
import { privateUser } from "../utils/serializers.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "30d" });

const sendAuth = (res, status, user) =>
  res.status(status).json({ ...privateUser(user), token: signToken(user._id) });

export const registerUser = async (req, res) => {
  const { username = "", email = "", password = "", avatar } = req.body;

  if (username.trim().length < 2) throw new HttpError(400, "Username must be at least 2 characters");
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new HttpError(400, "Enter a valid email address");
  if (password.length < 6) throw new HttpError(400, "Password must be at least 6 characters");

  const exists = await User.findOne({
    $or: [{ email: email.trim().toLowerCase() }, { username: username.trim() }],
  });
  if (exists) throw new HttpError(409, "That username or email is already registered");

  const user = await User.create({
    username,
    email,
    password,
    avatar: AVATARS.includes(avatar) ? avatar : DEFAULT_AVATAR,
  });

  sendAuth(res, 201, user);
};

export const loginUser = async (req, res) => {
  const { email = "", password = "" } = req.body;

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError(401, "Incorrect email or password");
  }

  sendAuth(res, 200, user);
};

export const getMe = (req, res) => {
  res.json(privateUser(req.user));
};
