// src/middlewares/validateMiddleware.js
const { body, param, validationResult } = require("express-validator");

const validateBlogPostCreation = [
  body("title")
    .isString()
    .withMessage("Title must be a string.")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters long."),
  body("body")
    .isString()
    .withMessage("Body must be a string.")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Body must be at least 20 characters long."),
  body("tag").optional().isString().withMessage("Tag should be a string."),
];

const validateBlogId = [
  param("id").isMongoId().withMessage("Invalid blog ID format."),
];

const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateBlogPostCreation,
  validateBlogId,
  handleValidationError,
};
