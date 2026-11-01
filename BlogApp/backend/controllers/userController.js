import User from "../models/User.js";
import Post from "../models/Post.js";
import { AVATARS } from "../config/avatars.js";
import { HttpError } from "../utils/http.js";
import { publicUser, privateUser } from "../utils/serializers.js";

// GET /api/users/:id  (public profile)
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, "User not found");

  const postCount = await Post.countDocuments({ author: user._id, status: { $ne: "draft" } });
  res.json({ ...publicUser(user), postCount });
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
  const { username, bio, avatar } = req.body;
  const user = req.user;

  if (username !== undefined) {
    if (username.trim().length < 2) throw new HttpError(400, "Username must be at least 2 characters");
    user.username = username;
  }
  if (bio !== undefined) user.bio = bio.trim();
  if (avatar !== undefined) {
    if (!AVATARS.includes(avatar)) throw new HttpError(400, "Pick one of the doodle avatars");
    user.avatar = avatar;
  }

  await user.save();
  res.json(privateUser(user));
};
