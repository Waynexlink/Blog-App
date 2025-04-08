const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: " Unknown",
    },
    tag: {
      type: String,
      default: null,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      unique: true,
      trim: true,
      minLength: [5, "A title cannot be below 5 character"],
      maxLength: [100, "A title cannot exceed 100 character long"],
      //okay
    },
    body: {
      type: String,
      required: [true, "Please provide the content for the blog post "],
      minLength: [20, "Blog body must be above 20 character long"],
    },
  },
  { timestamps: true }
);
blogSchema.pre("save", function (next) {
  this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
