const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

//REGISTERING ROUTES
const blogRoute = require("./src/routes/blogRoute");

//INTIALIZING APP
const app = express();

dotenv.config();

//STARTING UP DATABASE
mongoose
  .connect(process.env.DATABASE_CONNECTION_URI)
  .then(() => {
    console.log("database has been connected successfully");
  })
  .catch((error) => console.log(error.message));

//MIDDLEWARES
//BODYPARSER MIDDLEWARE
app.use(express.json());
app.use(morgan("tiny"));

app.use("/blog", blogRoute);
//STARTING UP SERVER
app.get("/", (req, res) => {
  res.send("hello world welcome to the blog App");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server has been started");
});
