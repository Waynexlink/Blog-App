// src/models/blogModel.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    // name: { // <-- REMOVE THIS
    //   type: String,
    //   default: " Unknown",
    // },
    author: {
      // <-- ADD THIS
      type: mongoose.Schema.ObjectId,
      ref: "User", // Reference the User model
      required: [true, "Blog post must belong to an author."],
    },
    tag: {
      type: String, // Consider changing to [String] for multiple tags later
      default: null,
    },
    dateCreated: {
      // Note: timestamps:true provides createdAt, you might not need this
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      // unique: true, // <-- REMOVE or COMMENT OUT for now
      trim: true,
      minLength: [5, "A title cannot be below 5 character"],
      maxLength: [100, "A title cannot exceed 100 character long"],
    },
    body: {
      type: String,
      required: [true, "Please provide the content for the blog post "],
      minLength: [20, "Blog body must be above 20 character long"],
    },
    slug: String, // <-- ADD slug field explicitly if using pre-save hook
    // Add like tracking later if needed
    // likedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Ensure virtual properties are included in JSON output
    toObject: { virtuals: true }, // Ensure virtual properties are included when converting to objects
  }
);

// --- Slug Generation ---
blogSchema.pre("save", function (next) {
  // Check if title is modified to avoid regenerating slug on every save
  if (!this.isModified("title")) {
    return next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Add logic here later to ensure slug uniqueness if needed
  next();
});

// --- Populate Author Information ---
// Automatically populate author details whenever finding blogs
blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email", // Select which fields from the User model to show
  });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
