const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: [true, "input a valid post"],
  },
});

const Blog = mongoose.model("Blog", blogSchema);
