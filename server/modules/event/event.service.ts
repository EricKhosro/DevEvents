import Event from "./event.model";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";
import { getUserInfo } from "../user/user.action";
import { EventMessages } from "./event.messages";

export const EventService = {
  async createEvent(eventDTO: any, file: File, tags: string, agenda: string) {
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
    const user = await getUserInfo();
    const createdEvent = await Event.create({
      ...eventDTO,
      tags: parsedTags,
      agenda: parsedAgenda,
      createdBy: user._id,
    });

    return createdEvent;
  },

  async fetchEvents() {
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    if (!events || !events.length)
      throw new createHttpError.NotFound(EventMessages.NoEvents);
    return events;
  },

  async fetchEventBySlug(slug: string) {
    const sanitizedSlug = slug.trim().toLowerCase();
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      throw new createHttpError.NotFound(EventMessages.NotFound);
    }

    return event;
  },
};
