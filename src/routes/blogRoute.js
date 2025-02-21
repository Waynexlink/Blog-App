const express = require("express");
const blogRoute = express.Router();

// Define routes
blogRoute.get("/", (req, res) => {
  res.send("This is the blog route");
});

blogRoute.post("/", (req, res) => {
  res.send("Create a new blog post");
});

// Export the router
module.exports = blogRoute;
