// src/models/userModel.js
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true, // Convert email to lowercase
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, // Do not send password hash in query results by default
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password; // Check if passwordConfirm matches password
      },
      message: "Passwords are not the same!",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Define possible roles
    default: "user",
  },
  passwordChangedAt: Date, // Optional: Track when password was last changed
});

// --- Password Hashing Middleware ---
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field - we don't need to save it
  this.passwordConfirm = undefined;
  next();
});

// --- Instance Method to Compare Passwords ---
// (Available on all documents created from this schema)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // userPassword is the hashed password from the DB
  // candidatePassword is the plain text password from the user input
  // Need 'this.password' because password has select: false
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Optional: Middleware to track password changes
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // Sometimes saving to DB is slower than issuing JWT, ensure timestamp is slightly in the past
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
