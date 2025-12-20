import connectDB from "@/server/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@/server/modules/event/event.service";
import { getSafeUserInfo } from "@/server/modules/user/user.action";
import { Role } from "@/shared/constants/role.constant";

type RouteParam = {
  slug: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParam> }
) {
  const { slug } = await params;
  try {
    await connectDB();

    const user = await getSafeUserInfo();
    const includeUnapproved = !!user && user.role === Role.Admin;

    const event = await EventService.fetchEventBySlug(slug, includeUnapproved);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error({ error });
    const anyError = error as any;
    const status =
      typeof anyError?.statusCode === "number" ? anyError.statusCode : 500;
    const message =
      error instanceof Error && error.name === "HttpError"
        ? error.message
        : "Internal Server Error";
    return NextResponse.json({ message }, { status });
  }
}
