"use server";

import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { IMe } from "@/shared/types/auth.types";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

export const getUserInfo = async (): Promise<IMe | null> => {
  const authToken = (await cookies())
    .get(AuthTokenCookieName)
    ?.value.toString();
  if (!authToken) return null;

  const { email, username, avatar }: any = decode(authToken);
  return { email, username, avatar };
};
