import { Types } from "mongoose";

export type EventCreatorRef =
  | Types.ObjectId
  | {
      _id: Types.ObjectId;
      username?: string | null;
    };

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: EventCreatorRef;
  approved: boolean;
}
