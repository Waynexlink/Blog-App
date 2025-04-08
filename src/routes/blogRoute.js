// src/routes/blogRoute.js
const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController"); // <--- ADD THIS
const {
  validateBlogPostCreation,
  validateBlogId,
  handleValidationError,
} = require("../middlewares/validateRoute"); // Ensure correct path if structure changed

const router = express.Router();

// --- Public Routes ---
// Anyone can get all blogs or a single blog
router.get("/", blogController.getAllBlogs);
router.get(
  "/:id",
  validateBlogId,
  handleValidationError,
  blogController.getBlog
);

// --- Protected Routes (Require Login) ---
// Apply protect middleware to all routes below this line
router.use(authController.protect);

router.post(
  "/",
  validateBlogPostCreation, // Ensure validation matches new model (no unique title check needed here now)
  handleValidationError,
  blogController.createBlog
);

router.patch(
  "/:id",
  validateBlogId,
  // Add body validation for update if needed
  handleValidationError,
  blogController.updateBlog
);

router.delete(
  "/:id",
  validateBlogId,
  handleValidationError,
  // Optionally restrict delete to admin: authController.restrictTo('admin'),
  blogController.deleteBlog
);

// --- Nested Route for Comments (will add later) ---
// Example: router.use('/:blogId/comments', commentRouter);

module.exports = router;
