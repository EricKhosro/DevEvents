"use server";

import { default as Event } from "@/server/modules/event/event.model";
import connectDB from "@/server/db/mongodb";
import { default as Booking } from "@/server/modules/booking/booking.model";
import { IEvent } from "@/shared/types/event.types";

export const getSimilarEventsBySlug = async (
  slug: string
): Promise<IEvent[]> => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });

    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
      approved: true,
    }).lean<IEvent[]>();
  } catch {
    return [] as IEvent[];
  }
};

export const createBooking = async ({
  email,
  eventId,
  slug,
}: {
  eventId: string;
  email: string;
  slug: string;
}) => {
  try {
    await connectDB();

    await Booking.create({ email, eventId, slug });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
