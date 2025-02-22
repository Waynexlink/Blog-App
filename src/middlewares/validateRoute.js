const { body, param, validationResult } = require("express-validator");

const validateBlogPostCreation = [
  body("title")
    .isString()
    .isLength({ min: 5 })
    .withMessage("title must contain more than 20 character"),
  body("body")
    .isString()
    .isLength({ min: 20 })
    .withMessage("title must contain more than 20000 character"),
  body("tag")
    .optional()
    .isString()
    .withMessage("tag should be a string of array"),
];

const validateBlogId = [param("id").isMongoId().withMessage("invalidid")];

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
