import EventCard from "@/components/EventCard";
import { IEvent } from "@/shared/types/event.types";
import { BaseUrl } from "@/shared/utils/env.utils";
import { cacheLife, cacheTag } from "next/cache";

const CachedEvents = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("events");

  const response = await fetch(`${BaseUrl}/api/events`);
  const events = await response.json();

  return (
    <div className="pt-20 space-y-7" id="cached-events">
      <h3>Featured Events</h3>
      <ul className="events">
        {events && events.length ? (
          events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};

export default CachedEvents;
