"use server";

import { Booking } from "@/database";
import connectDB from "../mongodb";

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
