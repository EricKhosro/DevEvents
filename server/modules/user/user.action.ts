"use server";

import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { IMe } from "@/shared/types/auth.types";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserService } from "./user.service";
import { UserMessages } from "./user.message";
import { AuthError } from "./user.errors";
import { redirect } from "next/navigation";

export const getUserInfo = async (): Promise<IMe> => {
  const authToken = (await cookies())
    .get(AuthTokenCookieName)
    ?.value.toString();
  if (!authToken) throw new AuthError(UserMessages.Unauthorized, 401);

  const decodedToken = verify(authToken, process.env.JWT_PRIVATE_KEY!) as {
    email: string;
  };

  const user = await UserService.findByEmail(decodedToken.email);
  if (!user) throw new AuthError(UserMessages.NotFound, 401);
  const { email, avatar, username, _id } = user;
  return { email, avatar, username, _id: _id as string };
};

export async function requireAuth(): Promise<IMe> {
  const token = (await cookies()).get(AuthTokenCookieName)?.value;

  if (!token) {
    redirect("/auth");
  }

  const decoded = verify(token, process.env.JWT_PRIVATE_KEY!) as {
    email?: string;
  } | null;

  if (!decoded?.email) {
    redirect("/auth");
  }

  const user = await UserService.findByEmail(decoded.email);

  if (!user) {
    redirect("/auth");
  }

  return {
    _id: (user._id as any).toString(),
    email: user.email,
    username: user.username,
    avatar: user.avatar,
  };
}

export const getSafeUserInfo = async (): Promise<IMe | null> => {
  try {
    return await getUserInfo();
  } catch {
    return null;
  }
};
