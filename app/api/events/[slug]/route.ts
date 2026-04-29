import { revalidateTag } from "next/cache";
import { EventMessages } from "@/server/modules/event/event.messages";
import { EventService } from "@/server/modules/event/event.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParam = {
  slug: string;
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<RouteParam> },
) => {
  try {
    const { slug } = await params;
    await EventService.deleteEvent(slug);

    revalidateTag("events", { expire: 0 });
    revalidateTag(slug, { expire: 0 });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error, message: EventMessages.UnableToDelete },
      { status: 500 },
    );
  }
};
