// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); // Node util to convert callback functions to promises
const User = require("../models/userModel");
const catchAsync = require("../utils/utilAsync");
const AppError = require("../utils/AppError");

// --- Function to Sign JWT ---
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// --- Function to Create and Send JWT via Cookie ---
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Convert days to ms
    ),
    httpOnly: true, // Cookie cannot be accessed or modified by the browser (prevents XSS)
    secure: process.env.NODE_ENV === "production", // Cookie only sent on HTTPS
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token, // Also send token in response body (optional, depends on frontend needs)
    data: {
      user,
    },
  });
};

// --- Signup Controller ---
exports.signup = catchAsync(async (req, res, next) => {
  // Filter request body to prevent users setting role manually during signup
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role, // Consider removing 'role' or explicitly setting to 'user'
  });

  createSendToken(newUser, 201, res);
});

// --- Login Controller ---
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  // Need .select('+password') because password field is not selected by default
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); // 401 Unauthorized
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// --- Logout Controller --- (Simple version: clears cookie)
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// --- Protect Middleware (Authorization) ---
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    // Check for token in cookies as fallback
    token = req.cookies.jwt;
  }

  if (!token || token === "loggedout") {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // decoded will be the payload: { id: 'userId', iat: timestamp, exp: timestamp }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Optional: Check if user changed password after the token was issued
  // (You'll need to add a `passwordChangedAt` field and logic in the userModel if you use this)
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError('User recently changed password! Please log in again.', 401));
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // Attach user to the request object
  res.locals.user = currentUser; // Also make user available in templates (if using server-side rendering)
  next();
});

// --- Restrict To Middleware (Role-based Authorization) ---
exports.restrictTo = (...roles) => {
  // roles is an array like ['admin', 'lead-guide']
  return (req, res, next) => {
    // req.user is set by the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403) // 403 Forbidden
      );
    }
    next();
  };
};
