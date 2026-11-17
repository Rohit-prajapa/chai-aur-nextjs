import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Forgot Password Fields
    forgotPasswordToken: {
      type: String,
    },

    forgotPasswordTokenExpiry: {
      type: Number,
    },

    // Email Verification Fields
    verifyToken: {
      type: String,
    },

    verifyTokenExpiry: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
