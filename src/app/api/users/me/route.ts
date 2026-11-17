
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getDatafromToken } from "@/helpers/getDatafromToken";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
  try {
    await connect();

    const userId = getDatafromToken(request);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Get User Details Error:", error);

    return NextResponse.json(
      { message: "Unauthorized or user not found" },
      { status: 401 }
    );
  }
}
