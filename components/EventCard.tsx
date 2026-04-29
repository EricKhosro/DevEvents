import Image from "next/image";
import Link from "next/link";
import type { EventCreatorRef } from "@/shared/types/event.types";
import DeleteEventButton from "./DeleteEventButton";

interface IProps {
  slug: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
  createdBy?: EventCreatorRef | null;
  approved: boolean;
  canDelete?: boolean;
}

const EventCard = ({
  image,
  title,
  date,
  location,
  slug,
  time,
  createdBy,
  canDelete = false,
  approved = false,
}: IProps) => {
  const creatorUsername =
    createdBy &&
    typeof createdBy === "object" &&
    "username" in createdBy &&
    createdBy.username
      ? createdBy.username
      : "Unknown";

  return (
    <div id="event-card" className="relative">
      {!approved ? (
        <div className="absolute rotate-45 border-2 border-primary rounded-xl px-2 top-5 -right-5 bg-black">
          Not Approved
        </div>
      ) : (
        <></>
      )}
      {canDelete ? <DeleteEventButton slug={slug} /> : null}
      <Link href={`/events/${slug}`} className="flex flex-col gap-3">
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />

        <div className="flex flex-row gap-2 w-full">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          <p>{location}</p>
        </div>

        <p className="title">{title}</p>

        <div className="datetime">
          <div>
            <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
            <p>{date}</p>
          </div>
          <div>
            <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
            <p>{time}</p>
          </div>
        </div>
        <div className="text-xs text-light-200 ml-auto">
          Created by {creatorUsername}
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
