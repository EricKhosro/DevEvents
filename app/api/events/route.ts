import { Event } from "@/database";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    let event;
    try {
      //validation with zod should be added
      event = Object.fromEntries(formData.entries());
      console.log({ event });
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON Format" },
        { status: 400 }
      );
    }
    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((res, rej) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "DevEvent",
          },
          (error, result) => {
            if (error) return rej(error);
            res(result);
          }
        )
        .end(buffer);
    });

    const tags = (formData.get("tags") as string).split(",");
    const agenda = (formData.get("agenda") as string).split(",");

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });
    revalidateTag("events", { expire: 0 });

    return NextResponse.json(
      {
        message: "Event Created Successfully",
        event: createdEvent,
      },
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
