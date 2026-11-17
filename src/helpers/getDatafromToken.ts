
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const getDatafromToken = (request: NextRequest): string => {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      throw new Error("Token not found");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as TokenPayload;

    return decodedToken.id;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Invalid token");
  }
};
