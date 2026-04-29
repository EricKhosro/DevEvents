import { v2 as cloudinary } from "cloudinary";
import { EventRepository } from "./event.repository";
import { getSafeUserInfo } from "../user/user.action";
import { Role } from "@/shared/constants/constant";
import { IUser } from "@/shared/types/auth.types";
import { Types } from "mongoose";
import { EventSchema } from "./event.model";
import createHttpError from "http-errors";
import { UserMessages } from "../user/user.message";

export const EventService = {
  async createEvent(
    eventDTO: any,
    file: File,
    tags: string,
    agenda: string,
    user: IUser,
  ) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    const eventData = {
      ...eventDTO,
      image: uploadResult.secure_url,
      tags: tags.split(","),
      agenda: agenda.split(","),
      createdBy: user._id,
      approved: user.role === Role.Admin ? true : false,
    };

    return EventRepository.create(eventData);
  },

  async fetchEvents(filter: Record<string, unknown> = {}) {
    const safeFilter: Record<string, unknown> = { ...filter };
    if (!("deleted" in safeFilter)) {
      safeFilter.deleted = { $ne: true };
    }
    return EventRepository.findMany(safeFilter);
  },

  async fetchVisibleEvents(user: (IUser & { _id: Types.ObjectId }) | null) {
    let filter: any = {};
    if (!user) filter = { approved: true };
    else if (user && user.role === Role.Admin) filter = {};
    else
      filter = {
        $or: [{ approved: true }, { createdBy: user._id }],
      };

    return this.fetchEvents(filter);
  },

  async fetchEventBySlug(slug: string): Promise<EventSchema | null> {
    const sanitizedSlug = this.sanitizeSlug(slug);
    const event = await EventRepository.findBySlug(sanitizedSlug);
    if (!event) return null;
    if ((event as { deleted?: boolean }).deleted === true) return null;
    if (event.approved) return event;

    const user = await getSafeUserInfo();
    if (!user) return null;
    if (
      user.role === Role.Admin ||
      user._id.toString() === event.createdBy.toString()
    )
      return event;

    return null;
  },

  async fetchSimilarEventsBySlug(slug: string, options?: { limit: number }) {
    const sanitizedSlug = this.sanitizeSlug(slug);
    const event = await EventRepository.findBySlug(sanitizedSlug);
    const user = await getSafeUserInfo();
    const isAdmin = user && user.role === Role.Admin ? true : false;

    const results = await EventRepository.findSimilarEventsBySlug(
      sanitizedSlug,
      event?.tags,
      {
        limit: options?.limit || 5,
        includeUnapproved: isAdmin,
      },
    );
    return results.filter(
      (item) => (item as { deleted?: boolean }).deleted !== true,
    );
  },

  sanitizeSlug(slug: string) {
    return slug.trim().toLowerCase();
  },

  async deleteEvent(slug: string) {
    const sanitizedSlug = this.sanitizeSlug(slug);

    const userInfo = await getSafeUserInfo();
    if (!userInfo)
      throw createHttpError.Unauthorized(UserMessages.Unauthorized);

    let isAdmin = userInfo.role === Role.Admin;
    let canDelete = isAdmin;
    if (!isAdmin) {
      const event = await this.fetchEventBySlug(sanitizedSlug);
      if (userInfo._id === event?.createdBy) canDelete = true;
    }

    if (!canDelete) throw createHttpError.Forbidden(UserMessages.Forbidden);

    const res = await EventRepository.deleteEventBySlug(sanitizedSlug);
    console.log({ res });
  },
};
