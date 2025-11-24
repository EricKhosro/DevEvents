import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParam = {
  slug: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<RouteParam> }
) {
  const { slug } = await params;
  console.log({ slug });
  try {
    await connectDB();

    try {
      const sanitizedSlug = slug.trim().toLowerCase();
      const event = await Event.findOne({ slug: sanitizedSlug }).lean();
      if (!event)
        return NextResponse.json(
          { message: "Event Not Found" },
          { status: 404 }
        );

      return NextResponse.json(event, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        {
          message: `Error in Fetching ${slug}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
