import EventCard from "@/components/EventCard";
import { IEvent } from "@/shared/types/event.types";
import { EventService } from "@/server/modules/event/event.service";
import { getSafeUserInfo } from "@/server/modules/user/user.action";
import { Role } from "@/shared/constants/constant";

const Events = async () => {
  const user = await getSafeUserInfo();

  const events = await EventService.fetchVisibleEvents(user);
  return (
    <div className="pt-20 space-y-7" id="cached-events">
      <h3>Featured Events</h3>
      <ul className="events">
        {events && events.length ? (
          events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard
                canDelete={(() => {
                  if (!user) return false;
                  if (user.role === Role.Admin) return true;
                  if (!event.createdBy) return false;
                  if (typeof event.createdBy === "object") {
                    const creatorId = "_id" in event.createdBy
                      ? (event.createdBy as { _id?: unknown })._id
                      : event.createdBy;
                    return String(creatorId) === String(user._id);
                  }
                  return String(event.createdBy) === String(user._id);
                })()}
                {...event}
              />
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
