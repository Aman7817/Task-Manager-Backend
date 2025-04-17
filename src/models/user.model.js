// Import required modules
import mongoose, { Schema } from "mongoose";  // Mongoose for MongoDB ORM
import jwt from "jsonwebtoken";               // JWT for creating access and refresh tokens
import bcrypt from "bcrypt";                 // Bcrypt for hashing passwords

// Define the User schema for MongoDB
const userSchema = new Schema(
  {
    // Username field: must be unique, trimmed, lowercase, and indexed
    username: {
      type: String,      
      required: true,     
      unique: true,       
      trim: true,         
      lowercase: true,    
      index: true         
    },

    // Full name field: required and trimmed
    fullname: {
      type: String,       // Data type: String
      required: false,     // Field is required
      trim: true,         // Remove leading/trailing whitespaces
      index: true         // Create an index for faster lookups
    },
    // User's phone number
    phone: {
        type: String,
        required: false
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },

    // Password field: Stores the user's password (hashed)
    password: {
      type: String,        // Data type: String (hashed password)
      required: [true, 'Password is required'], 
    },

    // Refresh token: Used to generate a new access token when the old one expires
    refreshToken: {
      type: String,        // Data type: String (refresh token)
    }
  },
  {
    timestamps: true       // Automatically add createdAt and updatedAt timestamps
  }
);

// Middleware to hash the password before saving the user document
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (not already hashed)
  if (!this.isModified("password")) return next();

  // Hash the password using bcrypt with 10 rounds of salt
  this.password = await bcrypt.hash(this.password, 10);
  
  // Continue the save operation
  next();
});

// Instance method to check if a provided password matches the stored password
userSchema.methods.isPasswordCorrect = async function (password) {
  // Compare the provided password with the stored (hashed) password
  return await bcrypt.compare(password, this.password);
};

// Instance method to generate an access token
userSchema.methods.generateAccessToken = function () {
  // Sign a new JWT with the user's ID, email, username, and fullname
  return jwt.sign(
    {
      _id: this._id,          // User's unique ID
      email: this.email,      // User's email
      username: this.username, // User's username
      fullname: this.fullname // User's full name
    },
    process.env.ACCESS_TOKEN_SECRET,   // Secret key for signing the access token
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Set token expiration time (from environment variable)
    }
  );
};

// Instance method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  // Sign a new JWT with the user's ID
  return jwt.sign(
    {
      _id: this._id,   // User's unique ID
    },
    process.env.REFRESH_TOKEN_SECRET,   // Secret key for signing the refresh token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Set token expiration time (from environment variable)
    }
  );
};

// Create and export the User model from the schema
export const User = mongoose.model("User", userSchema);
