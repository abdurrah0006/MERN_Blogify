import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { HttpError } from "../utils/http.js";

// GET /api/comments/:postId
export const getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });
  res.json(comments);
};

// POST /api/comments/:postId
export const addComment = async (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) throw new HttpError(400, "Comment can't be empty");

  const post = await Post.findById(req.params.postId);
  if (!post || post.status === "draft") throw new HttpError(404, "Post not found");

  const comment = await Comment.create({ text, user: req.user._id, post: post._id });
  res.status(201).json(await comment.populate("user", "username avatar"));
};

// DELETE /api/comments/:id  (comment author or the post's author)
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new HttpError(404, "Comment not found");

  const post = await Post.findById(comment.post);
  const isCommenter = comment.user.equals(req.user._id);
  const isPostAuthor = post?.author.equals(req.user._id);
  if (!isCommenter && !isPostAuthor) throw new HttpError(403, "You can't delete this comment");

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};
