import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";
import { EventMessages } from "./event.messages";
import { EventRepository } from "./event.repository";

export const EventService = {
  async createEvent(
    eventDTO: any,
    file: File,
    tags: string,
    agenda: string,
    userId: string
  ) {
    const buffer = Buffer.from(await file.arrayBuffer());

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

    // 2️⃣ Prepare data
    const eventData = {
      ...eventDTO,
      image: uploadResult.secure_url,
      tags: tags.split(","),
      agenda: agenda.split(","),
      createdBy: userId,
    };

    // 3️⃣ Persist
    return EventRepository.create(eventData);
  },

  async fetchEvents(filter: Record<string, unknown> = {}) {
    return EventRepository.findMany(filter);
  },

  async fetchEventBySlug(slug: string, includeUnapproved = false) {
    const sanitizedSlug = slug.trim().toLowerCase();

    const event = await EventRepository.findBySlug(sanitizedSlug, {
      includeUnapproved,
    });

    if (!event) {
      throw new createHttpError.NotFound(EventMessages.NotFound);
    }

    return event;
  },
};
