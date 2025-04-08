// app.js
const express = require("express");
const morgan = require("morgan");
const expressSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cors = require("cors");
const expressRateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser"); // <--- ADD THIS

const blogRoute = require("./src/routes/blogRoute");
const authRoute = require("./src/routes/authRoute"); // <--- ADD THIS
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

// ... (keep your limiter and corsOptions) ...
const corsOptions = {
  // Make sure origin includes your frontend URL (replace if needed)
  // For development with cookies, you might need localhost explicitly
  origin: [
    "https://your-frontend-domain.com",
    "http://localhost:3000",
    "http://localhost:5173",
  ], // Added common Vite port
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // IMPORTANT: Allow cookies for CORS requests
};

// --- GLOBAL MIDDLEWARES ---

// Enable CORS
app.use(cors(corsOptions));
// Allow OPTIONS requests for all routes (important for preflight checks with credentials/headers)
app.options("*", cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Changed to 'dev' for more info during dev
} else {
  app.use(morgan("tiny"));
}

// Limit requests from same API
const limiter = expressRateLimit({
  // Use expressRateLimit directly
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 requests per hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter); // Apply limiter to all routes starting with /api (good practice)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" })); // Limit body payload size
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // For form data

// Cookie parser
app.use(cookieParser()); // <--- ADD THIS

// Data sanitization against NoSQL query injection
app.use(expressSanitize());

// Data sanitization against XSS (Basic - consider frontend libraries like DOMPurify too)
// app.use(xssClean()); // Re-evaluate if needed, can sometimes cause issues

// --- ROUTES ---
// Mount routers
app.use("/api/v1/blogs", blogRoute); // <-- Best practice: prefix API routes
app.use("/api/v1/auth", authRoute); // <-- Best practice: prefix API routes

// --- ERROR HANDLING ---
// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
