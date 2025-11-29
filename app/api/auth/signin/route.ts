import { errorHandler } from "@/server/middlewares/errorHandler";
import { UserMessages } from "@/server/modules/user/user.message";
import { UserService } from "@/server/modules/user/user.service";
import { SharedMessages } from "@/shared/utils/shared.messages";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { LoginSchema } from "@/server/modules/user/user.zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    if (!body) throw createHttpError.BadRequest(SharedMessages.BodyRequired);
    const parsedBody = LoginSchema.safeParse(body);
    if (!parsedBody.success)
      return NextResponse.json(
        {
          errors: parsedBody.error.issues.flat(),
          message: UserMessages.InvalidCredentials,
        },
        { status: 400 }
      );

    const { username, password } = parsedBody.data;
    const token = await UserService.login(username, password);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    };

    const cookieHeader = cookie.serialize(
      AuthTokenCookieName,
      token,
      cookieOptions
    );

    return NextResponse.json(
      { message: UserMessages.Login },
      { status: 200, headers: { "Set-Cookie": cookieHeader } }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
