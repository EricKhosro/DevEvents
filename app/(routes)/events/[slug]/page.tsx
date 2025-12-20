import CachedEventDetails from "./CachedEventDetails";
import SimilarEvents from "./SimilarEvents";
import { getSafeUserInfo } from "@/server/modules/user/user.action";
import { Role } from "@/shared/constants/role.constant";

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const user = await getSafeUserInfo();
  const isAdmin = !!user && user.role === Role.Admin;

  return (
    <section id="event">
      <CachedEventDetails params={params} canApprove={isAdmin} />
      <SimilarEvents params={params} />
    </section>
  );
};

export default EventDetails;
