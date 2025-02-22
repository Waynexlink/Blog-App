var express = require("express");
const {
  createBlog,
  getAllBlogs,
  deleteBlog,
  getBlog,
  updateTour,
} = require("../controllers/blogController");
const blogController = "../controllers/blogController.js";

//STARTING UP ROUTER
const blogRoute = express.Router();

// Define routes
blogRoute.get("/", getAllBlogs);

blogRoute.post("/", createBlog);

blogRoute.get("/:id", getBlog);

blogRoute.patch("/:id", updateTour);

blogRoute.delete("/:id", deleteBlog);

// Export the router
module.exports = blogRoute;
