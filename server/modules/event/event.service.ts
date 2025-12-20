import Event, { EventSchema } from "./event.model";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";
import { EventMessages } from "./event.messages";
import { IEvent } from "@/shared/types/event.types";

export const EventService = {
  async createEvent(
    eventDTO: any,
    file: File,
    tags: string,
    agenda: string,
    userId: string
  ) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // Assign uploaded image URL
    eventDTO.image = (uploadResult as { secure_url: string }).secure_url;

    const parsedTags = tags.split(",");
    const parsedAgenda = agenda.split(",");
    const createdEvent = await Event.create({
      ...eventDTO,
      tags: parsedTags,
      agenda: parsedAgenda,
      createdBy: userId,
    });

    return createdEvent;
  },

  async fetchEvents(filter: Record<string, unknown> = {}): Promise<IEvent[]> {
    console.log({ filter });
    const events = await Event.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .lean<IEvent[]>();
    return events;
  },

  async fetchEventBySlug(
    slug: string,
    includeUnapproved = false
  ): Promise<IEvent> {
    const sanitizedSlug = slug.trim().toLowerCase();
    const query: Record<string, unknown> = { slug: sanitizedSlug };
    if (!includeUnapproved) {
      query.approved = true;
    }

    const event = await Event.findOne(query).lean<IEvent>();

    if (!event) {
      throw new createHttpError.NotFound(EventMessages.NotFound);
    }

    return event;
  },
};
