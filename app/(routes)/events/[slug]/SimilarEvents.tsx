import { getSimilarEventsBySlug } from "./action";
import EventCard from "@/components/EventCard";

const SimilarEvents = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const similarEvents = await getSimilarEventsBySlug(slug);
  return (
    <div className="flex w-full flex-col gap-4 pt-20">
      <h2>Similar Events</h2>
      <div className="events">
        {similarEvents.length > 0 &&
          similarEvents.map((similarEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
      </div>
    </div>
  );
};

export default SimilarEvents;
