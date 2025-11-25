import CachedEventDetails from "./CachedEventDetails";
import SimilarEvents from "./SimilarEvents";

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return (
    <section id="event">
      <CachedEventDetails params={params} />
      <SimilarEvents params={params} />
    </section>
  );
};

export default EventDetails;
