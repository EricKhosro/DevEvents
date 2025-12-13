"use server";

import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { IMe } from "@/shared/types/auth.types";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserService } from "./user.service";
import createHttpError from "http-errors";
import { UserMessages } from "./user.message";

export const getUserInfo = async (): Promise<IMe> => {
  const authToken = (await cookies())
    .get(AuthTokenCookieName)
    ?.value.toString();
  if (!authToken)
    throw new createHttpError.Unauthorized(UserMessages.Unauthorized);

  const decodedToken: any = decode(authToken);

  const user = await UserService.findByEmail(decodedToken.email);
  if (!user) throw new createHttpError.NotFound(UserMessages.NotFound);
  const { email, avatar, username, _id } = user;
  return { email, avatar, username, _id: _id as string };
};
