const { query } = require("express");
const Blog = require("../models/blogModel");
const apiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/utilAsync");

exports.getAllBlogs = catchAsync(async (req, res) => {
  const features = new apiFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const blogs = await features.query;
  res.status(200).json({
    //SUCCESS MESSAGE
    status: "success",
    result: blogs.length,
    data: {
      blogs,
    },
  });
});
exports.createBlog = catchAsync(async (req, res) => {
  const newBlog = await Blog.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Blog successfully created",
    data: {
      newBlog,
    },
  });
});
exports.deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError("Blog not found ", 404));
  res.status(204).end();
});
exports.getBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("Blog not found ", 404));
  res.status(200).json({
    status: "success",
    message: "Blog retrived successfully",
    data: {
      blog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res) => {
  const doc = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new AppError("Nothing to update here", 404));
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
