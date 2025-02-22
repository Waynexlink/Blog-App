var express = require("express");
const {
  validateBlogPostCreation,
  validateBlogId,
  handleValidationError,
} = require("../middlewares/validateRoute");
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

blogRoute.post(
  "/",
  validateBlogPostCreation,
  handleValidationError,
  createBlog
);

blogRoute.get("/:id", validateBlogId, handleValidationError, getBlog);

blogRoute.patch("/:id", validateBlogId, handleValidationError, updateTour);

blogRoute.delete("/:id", validateBlogId, handleValidationError, deleteBlog);

// Export the router
module.exports = blogRoute;
