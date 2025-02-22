const { query } = require("express");
const Blog = require("../models/blogModel");

exports.getAllBlogs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    //FILTERING
    const excludedField = ["page", "sort", "limit", "field"];
    excludedField.forEach((el) => {
      delete queryObj[el];
    });

    let query = Blog.find(queryObj);

    //SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-dataCreated");
    }
    //FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.field.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const blogs = await query;

    res.status(200).json({
      //SUCCESS MESSAGE
      status: "success",
      result: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (error) {
    //ERROR MESSAGE
    res.status(404).json({
      status: "failure",
      message: error.message,
    });
  }
};
exports.createBlog = async (req, res) => {
  try {
    console.log;
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
      //SUCCESS MESSAGE
      status: "success",
      data: {
        newBlog,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
};
exports.deleteBlog = async (req, res) => {
  try {
    const blog = Blog.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: blog,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const blog = Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
