import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { getDatafromToken } from "@/helpers/getDatafromToken";

export async function GET(request: NextRequest) {
  try {
    await connect();

    // Verify JWT and get user ID
    const userId = getDatafromToken(request);

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Profile Error:", error);

    return NextResponse.json(
      { message: "Unauthorized: Invalid or expired token" },
      { status: 401 },
    );
  }
}
