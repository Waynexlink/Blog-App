const express = require("express");
const morgan = require("morgan");
const expressSanitize = require("express-mongo-sanitize");
// const xssClean = require("xss-filters");
const helmet = require("helmet");
const cors = require("cors");
const expressRateLimit = require("express-rate-limit");

const blogRoute = require("./src/routes/blogRoute");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

const limiter = {
  windowMs: 15 * 100 * 1000,
  max: 100,
  message: "You've got to chill out",
};
const corsOptions = {
  origin: ["https://your-frontend-domain.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable cookies/auth headers if needed
};

//BODYPARSER MIDDLEWARE
app.use(express.json());
app.use(morgan("tiny"));
app.use(expressSanitize());
app.use(helmet());
// app.use(xssClean());
app.use(cors(corsOptions));
app.use(expressRateLimit(limiter));

//REGISTER ROUTES
app.use("/blog", blogRoute);

app.use(errorHandler);

module.exports = app;
