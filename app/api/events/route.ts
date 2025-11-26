import Event from "@/server/modules/event/event.model";
import connectDB from "@/server/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { EventService } from "@/server/modules/event/event.service";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    let event;
    try {
      // Validation could be added here (e.g., with Zod or Joi)
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON Format" },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const tags = formData.get("tags") as string;
    const agenda = formData.get("agenda") as string;

    // Call service to create the event
    const createdEvent = await EventService.createEvent(
      event,
      file,
      tags,
      agenda
    );

    // Revalidate the cache (assuming you're caching event list)
    revalidateTag("events", { expire: 0 });

    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 }
    );
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

export async function GET() {
  try {
    await connectDB();

    try {
      const events = await Event.find({}).sort({ createdAt: -1 }).lean();
      return NextResponse.json(events, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Error in Fetching Events",
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
