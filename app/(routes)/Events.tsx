import EventCard from "@/components/EventCard";
import { IEvent } from "@/shared/types/event.types";
import { EventService } from "@/server/modules/event/event.service";
import { getSafeUserInfo } from "@/server/modules/user/user.action";
import { Role } from "@/shared/constants/role.constant";

interface EventsProps {
  pendingOnly?: boolean;
}

const Events = async ({ pendingOnly }: EventsProps) => {
  const user = await getSafeUserInfo();
  const isAdmin = !!user && user.role === Role.Admin;
  const filter: Record<string, unknown> = {};

  if (isAdmin && pendingOnly) {
    filter.approved = false;
  } else if (!isAdmin) {
    filter.approved = true;
  }

  const events = await EventService.fetchEvents(filter);
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

export default Events;
