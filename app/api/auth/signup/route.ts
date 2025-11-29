import { errorHandler } from "@/server/middlewares/errorHandler";
import { UserMessages } from "@/server/modules/user/user.message";
import { UserService } from "@/server/modules/user/user.service";
import { SharedMessages } from "@/shared/utils/shared.messages";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    if (!body) throw createHttpError.BadRequest(SharedMessages.BodyRequired);
    const { email, password, rePassword } = body;
    const user = await UserService.register(email, password, rePassword);
    return NextResponse.json(
      { message: UserMessages.Register, user },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
