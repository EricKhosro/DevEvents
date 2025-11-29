import { UserService } from "@/server/modules/user/user.service";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { errorHandler } from "@/server/middlewares/errorHandler";

export const GET = async (req: NextRequest) => {
  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
  try {
    const token = await getToken({ req, secret: JWT_PRIVATE_KEY });
    if (!token?.email) {
      return NextResponse.redirect("/auth?error=NoEmail");
    }

    const appToken = UserService.generateAppToken(token.email);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    };

    const cookieHeader = cookie.serialize(
      "auth_token",
      appToken,
      cookieOptions
    );
    const url = new URL(req.url);
    return NextResponse.redirect(`${url.origin}/`, {
      headers: { "Set-Cookie": cookieHeader },
    });
  } catch (error) {
    return errorHandler(error);
  }
};
