import connectDB from "@/server/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@/server/modules/event/event.service";

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

    const event = await EventService.fetchEventBySlug(slug);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      {
        message:
          error instanceof Error && error.name === "HttpError"
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
