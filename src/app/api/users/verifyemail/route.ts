import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { token, userId } = await request.json();

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Token and user ID are required" },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified",
      });
    }

    // Check token and expiry
    if (
      !user.verifyToken ||
      !user.verifyTokenExpiry ||
      user.verifyTokenExpiry < Date.now()
    ) {
      return NextResponse.json(
        { error: "Verification token is invalid or expired" },
        { status: 400 },
      );
    }

    // Compare original token with hashed token
    const isValidToken = await bcrypt.compare(token, user.verifyToken);

    if (!isValidToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 },
      );
    }

    // Verify email
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email Verification Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
