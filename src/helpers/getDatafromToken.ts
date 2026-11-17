import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const getDatafromToken = (request: NextRequest): string => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: Token not found");
  }

  const secret = process.env.TOKEN_SECRET;

  if (!secret) {
    throw new Error("TOKEN_SECRET is missing");
  }

  const decoded = jwt.verify(token, secret) as TokenPayload;

  if (!decoded.id) {
    throw new Error("Invalid token payload");
  }

  return decoded.id;
};
