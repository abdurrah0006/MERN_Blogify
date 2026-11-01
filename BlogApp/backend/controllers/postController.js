import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { HttpError, escapeRegex, parseTags, readingTime, removeUpload } from "../utils/http.js";

const AUTHOR_FIELDS = "username avatar";

// List endpoints only need a short excerpt, not the whole article.
const toListItem = (post) => ({
  ...post,
  content: post.content.slice(0, 220),
  readingTime: readingTime(post.content),
});

const imagePath = (file) => (file ? `/uploads/${file.filename}` : undefined);

const getOwnedPost = async (req) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new HttpError(404, "Post not found");
  if (!post.author.equals(req.user._id)) throw new HttpError(403, "You can only change your own posts");
  return post;
};

// GET /api/posts?page=&limit=&search=&tag=&author=
export const getPosts = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(24, Math.max(1, parseInt(req.query.limit) || 9));
  const { search, tag, author } = req.query;

  // `$ne: "draft"` keeps posts created before the status field existed.
  const filter = { status: { $ne: "draft" } };

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: regex }, { content: regex }, { tags: regex }];
  }
  if (tag) filter.tags = new RegExp(`^${escapeRegex(tag)}$`, "i");
  if (author) filter.author = author;

  const [totalPosts, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .populate("author", AUTHOR_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  res.json({
    posts: posts.map(toListItem),
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
  });
};

// GET /api/posts/tags  (most used tags)
export const getTags = async (req, res) => {
  const tags = await Post.aggregate([
    { $match: { status: { $ne: "draft" } } },
    { $unwind: "$tags" },
    { $group: { _id: { $toLower: "$tags" }, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 12 },
  ]);
  res.json(tags.map((t) => ({ name: t._id, count: t.count })));
};

// GET /api/posts/mine  (includes drafts)
export const getMyPosts = async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .populate("author", AUTHOR_FIELDS)
    .sort({ createdAt: -1 })
    .lean();
  res.json(posts.map(toListItem));
};

// GET /api/posts/:id
export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", AUTHOR_FIELDS).lean();
  const isAuthor = post && req.user && post.author._id.equals(req.user._id);

  // Drafts are only visible to their author.
  if (!post || (post.status === "draft" && !isAuthor)) throw new HttpError(404, "Post not found");

  res.json({ ...post, readingTime: readingTime(post.content) });
};

// POST /api/posts  (multipart/form-data)
export const createPost = async (req, res) => {
  try {
    const { title = "", content = "", tags, status } = req.body;
    if (!title.trim() || !content.trim()) throw new HttpError(400, "Title and content are required");

    const post = await Post.create({
      title,
      content,
      tags: parseTags(tags),
      status: status === "draft" ? "draft" : "published",
      image: imagePath(req.file) ?? "",
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    if (req.file) removeUpload(imagePath(req.file));
    throw error;
  }
};

// PUT /api/posts/:id  (multipart/form-data)
export const updatePost = async (req, res) => {
  try {
    const post = await getOwnedPost(req);
    const { title, content, tags, status, removeImage } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = parseTags(tags);
    if (status === "draft" || status === "published") post.status = status;

    if (!post.title.trim() || !post.content.trim()) {
      throw new HttpError(400, "Title and content are required");
    }

    const previousImage = post.image;
    if (req.file) post.image = imagePath(req.file);
    else if (removeImage === "true") post.image = "";

    await post.save();
    if (post.image !== previousImage) removeUpload(previousImage);

    res.json(await post.populate("author", AUTHOR_FIELDS));
  } catch (error) {
    if (req.file) removeUpload(imagePath(req.file));
    throw error;
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  const post = await getOwnedPost(req);

  await Promise.all([post.deleteOne(), Comment.deleteMany({ post: post._id })]);
  removeUpload(post.image);

  res.json({ message: "Post deleted" });
};
