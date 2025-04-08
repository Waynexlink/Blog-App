const dotenv = require("dotenv");

const mongoose = require("mongoose");

const app = require("./app");

dotenv.config();

//STARTING UP DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database has been connected successfully");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

//STARTING UP SERVER
app.get("/", (req, res) => {
  res.send("hello world welcome to the blog App");
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server has been started");
});
