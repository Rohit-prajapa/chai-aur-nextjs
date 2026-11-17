import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Use the same response whether the account exists or not.
    if (user) {
      await sendEmail({
        email: user.email,
        emailType: "RESET",
        userId: user._id.toString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account exists with this email, a password reset link will be sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return NextResponse.json(
      { error: "Unable to process your request" },
      { status: 500 },
    );
  }
}
