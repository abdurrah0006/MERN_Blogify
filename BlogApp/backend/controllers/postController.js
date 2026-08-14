import Post from "../models/Post.js";


// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Handle uploaded image (if any)
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : "";

    // Normalize tags into an array
    const tagsArray = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim())
      : [];

    const post = await Post.create({
      title,
      content,
      image,
      tags: tagsArray,
      author: req.user._id,
    });

    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 6;

    const search = req.query.search || "";

    const category = req.query.category || "";

    // SEARCH QUERY
    const query = {
      title: {
        $regex: search,
        $options: "i",
      },
    };

    if (category) {
      query.tags = category;
    }

    // TOTAL POSTS COUNT
    const totalPosts = await Post.countDocuments(query);

    // FETCH POSTS
    const posts = await Post.find(query)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // SEND RESPONSE
    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE POST
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // OWNER CHECK
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // OWNER CHECK
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET LOGGED-IN USER POSTS
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
    })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

