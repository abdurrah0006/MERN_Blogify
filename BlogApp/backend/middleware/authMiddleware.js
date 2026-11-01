import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/http.js";

const userFromRequest = async (req) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;

  try {
    const { id } = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    return await User.findById(id);
  } catch {
    return null;
  }
};

// Requires a valid token.
export const protect = async (req, res, next) => {
  req.user = await userFromRequest(req);
  if (!req.user) throw new HttpError(401, "Please log in to continue");
  next();
};

// Attaches req.user when a valid token is sent, but never blocks.
export const optionalAuth = async (req, res, next) => {
  req.user = await userFromRequest(req);
  next();
};
