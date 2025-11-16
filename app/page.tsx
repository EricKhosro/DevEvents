import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  // "use cache";
  // cacheLife("hours");
  const res = await fetch(`${BASE_URL}/api/events`);
  const events = await res.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackatons, Meetups, and Conferences, All in{" "}
        <Link
          prefetch={false}
          target="_blank"
          className="font-bold"
          href="https://www.imdb.com/title/tt0388629/"
        >
          One Piece
        </Link>
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
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
    </section>
  );
};

export default Page;
