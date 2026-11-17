import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { token, userId, password } = await request.json();

    // Validate input
    if (!token || !userId || !password) {
      return NextResponse.json(
        { error: "Token, user ID and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid reset link" },
        { status: 404 },
      );
    }

    // Check token and expiry
    if (
      !user.forgotPasswordToken ||
      !user.forgotPasswordTokenExpiry ||
      user.forgotPasswordTokenExpiry < Date.now()
    ) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired" },
        { status: 400 },
      );
    }

    // Verify token
    const isTokenValid = await bcrypt.compare(token, user.forgotPasswordToken);

    if (!isTokenValid) {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await User.findByIdAndUpdate(userId, {
      $set: {
        password: hashedPassword,
      },
      $unset: {
        forgotPasswordToken: 1,
        forgotPasswordTokenExpiry: 1,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successfully. Please login with your new password.",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Reset Password Error:", error);

    return NextResponse.json(
      { error: "Something went wrong while resetting password" },
      { status: 500 },
    );
  }
}
