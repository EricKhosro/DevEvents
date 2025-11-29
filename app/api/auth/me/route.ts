import { NextRequest, NextResponse } from "next/server";
import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { IMe } from "@/shared/types/auth.types";
import { decode } from "jsonwebtoken";
import { UserService } from "@/server/modules/user/user.service";
import createHttpError from "http-errors";
import { UserMessages } from "@/server/modules/user/user.message";

export const GET = async (req: NextRequest): Promise<NextResponse<IMe>> => {
  const authToken = req.cookies.get(AuthTokenCookieName)?.value.toString();
  if (!authToken)
    return NextResponse.json(
      {
        email: null,
        avatar: null,
        username: null,
      },
      { status: 404 }
    );
  const decodedToken: any = decode(authToken);
  const user = await UserService.findByEmail(decodedToken.email);
  if (!user) throw createHttpError.NotFound(UserMessages.NotFound);

  return NextResponse.json({
    email: user.email,
    avatar: null,
    username: null,
  });
};
