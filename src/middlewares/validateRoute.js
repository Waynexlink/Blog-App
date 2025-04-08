// src/middlewares/validateRoute.js
const { body, param, validationResult } = require("express-validator");
const Blog = require("../models/blogModel"); // Required if doing custom unique checks

const validateBlogPostCreation = [
  body("title")
    .isString()
    .withMessage("Title must be a string.")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters long."), // Keep trailing comma if uncommenting above
  // .isUnique() // <-- REMOVE or COMMENT OUT this if you removed it from the model
  // Custom unique check example (more complex):
  // .custom(async (value, { req }) => {
  //    const blog = await Blog.findOne({ title: value, author: req.user.id });
  //    if (blog) {
  //      return Promise.reject('You already have a blog post with this title.');
  //    }
  // }),
  body("body")
    .isString()
    .withMessage("Body must be a string.")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Body must be at least 20 characters long."),
  body("tag").optional().isString().withMessage("Tag should be a string."),
  // If using array of tags later: .optional().isArray().withMessage('Tags must be an array.')
  // .custom(value => value.every(item => typeof item === 'string')).withMessage('Each tag must be a string.')
];

const validateBlogId = [
  param("id").isMongoId().withMessage("Invalid blog ID format."),
];

// Consider adding validation for Update operations as well
const validateBlogPostUpdate = [
  body("title").optional().isString().trim().isLength({ min: 5, max: 100 }),
  body("body").optional().isString().trim().isLength({ min: 20 }),
  body("tag").optional().isString(), // Or array validation
  // Add other fields as needed
];

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log errors for debugging if needed
    // console.error('Validation Errors:', errors.array());
    return res.status(400).json({ status: "fail", errors: errors.array() });
  }
  next();
};

module.exports = {
  validateBlogPostCreation,
  validateBlogId,
  validateBlogPostUpdate, // <-- EXPORT NEW VALIDATION
  handleValidationError,
};
