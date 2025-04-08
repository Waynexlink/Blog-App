// src/controllers/blogController.js
const Blog = require("../models/blogModel");
const apiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/AppError"); // <--- Ensure AppError is imported
const catchAsync = require("../utils/utilAsync");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  // Added next
  // BUILD QUERY
  const features = new apiFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // EXECUTE QUERY
  const blogs = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: blogs.length, // Renamed 'result' to 'results' for clarity
    data: {
      blogs,
    },
  });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  // Added next
  // Add author from the protected route (req.user set by authController.protect)
  const authorId = req.user.id; // Or req.user._id depending on structure
  const blogData = { ...req.body, author: authorId };

  const newBlog = await Blog.create(blogData);

  res.status(201).json({
    status: "success",
    message: "Blog successfully created",
    data: {
      blog: newBlog, // Renamed 'newBlog' to 'blog' for consistency
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  // Added next
  // .populate('author') might not be needed if using the pre-find hook in model
  const blog = await Blog.findById(req.params.id);
  // If using populate here: const blog = await Blog.findById(req.params.id).populate('author', 'name email');

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404)); // More specific error
  }

  res.status(200).json({
    status: "success",
    // Removed 'message' as it's often redundant on GET success
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  // Added next
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  // --- Authorization Check ---
  // Allow update only if user is the author OR an admin
  if (blog.author.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to update this post", 403)
    );
  }

  // Filter out disallowed fields if necessary (e.g., prevent changing author)
  const filteredBody = { ...req.body };
  delete filteredBody.author; // User shouldn't change the author field manually

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true, // Return the updated document
      runValidators: true, // Run model validators on update
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      blog: updatedBlog, // Renamed 'doc' to 'blog'
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  // Added next
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new AppError("No blog found with that ID", 404));
  }

  // --- Authorization Check ---
  // Allow delete only if user is the author OR an admin
  if (blog.author.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to delete this post", 403)
    );
  }

  await Blog.findByIdAndDelete(req.params.id);

  // Status 204 means "No Content" - standard for successful DELETE
  res.status(204).json({
    status: "success",
    data: null,
  });
});
