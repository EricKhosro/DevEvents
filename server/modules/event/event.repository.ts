// server/modules/event/event.repository.ts
import connectDB from "@/server/db/mongodb";
import Event from "./event.model";
import { IEvent } from "@/shared/types/event.types";

export const EventRepository = {
  async create(data: Partial<IEvent>) {
    await connectDB();
    return Event.create(data);
  },

  async findMany(filter: Record<string, unknown> = {}) {
    await connectDB();
    return Event.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .lean<IEvent[]>();
  },

  async findBySlug(slug: string, options?: { includeUnapproved?: boolean }) {
    await connectDB();

    const query: Record<string, unknown> = { slug };

    if (!options?.includeUnapproved) {
      query.approved = true;
    }

    return Event.findOne(query).lean<IEvent | null>();
  },
};
