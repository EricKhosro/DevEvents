import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";
import { EventMessages } from "./event.messages";
import { EventRepository } from "./event.repository";
import { getSafeUserInfo } from "../user/user.action";
import { Role } from "@/shared/constants/role.constant";
import { IEvent } from "@/shared/types/event.types";

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

  async fetchEventBySlug(slug: string): Promise<IEvent | null> {
    const sanitizedSlug = this.sanitizeSlug(slug);
    const user = await getSafeUserInfo();
    const includeUnapproved = user && user.role === Role.Admin ? true : false;
    const event = await EventRepository.findBySlug(sanitizedSlug, {
      includeUnapproved,
    });
    if (!event) return null;

    return event;
  },

  async fetchSimilarEventsBySlug(slug: string, options?: { limit: number }) {
    const sanitizedSlug = this.sanitizeSlug(slug);
    const event = await EventRepository.findBySlug(sanitizedSlug);
    const user = await getSafeUserInfo();
    const isAdmin = user && user.role === Role.Admin ? true : false;

    return await EventRepository.findSimilarEventsBySlug(
      sanitizedSlug,
      event?.tags,
      {
        limit: options?.limit || 5,
        includeUnapproved: isAdmin,
      }
    );
  },

  sanitizeSlug(slug: string) {
    return slug.trim().toLowerCase();
  },
};
