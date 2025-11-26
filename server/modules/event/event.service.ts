import Event from "./event.model";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

export const EventService = {
  async createEvent(eventDTO: any, file: File, tags: string, agenda: string) {
    try {
      // Convert file to buffer and upload to Cloudinary
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
      });

      return createdEvent;
    } catch (error) {
      throw createHttpError.InternalServerError("Error creating event");
    }
  },

  async fetchEvents() {
    try {
      return await Event.find({}).sort({ createdAt: -1 }).lean();
    } catch (error) {
      throw createHttpError.InternalServerError("Error fetching events");
    }
  },

  async fetchEventBySlug(slug: string) {
    const sanitizedSlug = slug.trim().toLowerCase();
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      throw Error("Event Not Found", { cause: "Event Service" });
    }

    return event;
  },
};
