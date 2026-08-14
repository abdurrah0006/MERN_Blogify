import Comment from "../models/Comment.js";


// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      user: req.user._id,
      post: req.params.postId,
    });

    const populated = await comment.populate(
      "user",
      "username avatar"
    );

    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Not found" });
    }

    if (
      comment.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not allowed" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};