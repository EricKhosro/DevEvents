 import { EventService } from "./event.service";
import { IEvent } from "@/shared/types/event.types";

export const GetEventDetails = async (slug: string): Promise<IEvent> => {
  try {
    return await EventService.fetchEventBySlug(slug);
  } catch (error) {
    
  }
};
