import { db } from "../utils/db.js";
import { fetchHashnodeBlogs } from "../utils/hashnode.js";

// GET /blogs - Fetch all blogs (platform + Hashnode)
export const getAllBlogs = async (req, res) => {
  try {
    // Fetch platform blogs
    const platformBlogs = await db.blog.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Fetch Hashnode blogs
    const publicationHost = "shreyansh-pandit.hashnode.dev";
    const { posts: hashnodeBlogs } = await fetchHashnodeBlogs(publicationHost, 10);

    // Combine blogs, marking platform blogs with type "platform"
    const combinedBlogs = [
      ...platformBlogs.map(blog => ({ ...blog, type: "platform" })),
      ...hashnodeBlogs,
    ];

    // Sort by createdAt (descending)
    combinedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ success: true, blogs: combinedBlogs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching blogs" });
  }
};

// GET /blogs/:id - Fetch a single platform blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await db.blog.findUnique({
      where: { id: id },
      include: { author: { select: { name: true } } },
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.status(200).json({ success: true, blog: { ...blog, type: "platform" } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching blog" });
  }
};

// POST /blogs - Create a new blog (authenticated Admins only)
export const createBlog = async (req, res) => {
  const { coverImage, title, content } = req.body;

  // Validation: Check for required fields
  if (!title || !content) {
    return res.status(400).json({
      error: "Missing required fields: 'title' and 'content' are required",
    });
  }

  try {
    // Assuming req.user is set by the isAuthenticated middleware
    const authorId = req.user.id;

    const newBlog = await db.blog.create({
      data: {
        coverImage: coverImage || null,
        title,
        content,
        authorId,
      },
      include: { author: { select: { name: true } } },
    });

    return res.status(201).json({
      success: true,
      blog: { ...newBlog, type: "platform" },
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating blog" });
  }
};