
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connect();

    // Get request body
    const reqBody = await request.json();

    const { username, email, password } = reqBody;

    console.log(reqBody);

    // Validate fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user in database
    const savedUser = await newUser.save();

    console.log("User created successfully:", savedUser._id);

    // Return success response (without password)
    return NextResponse.json(
      {
        message: "User Created Successfully",
        success: true,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
