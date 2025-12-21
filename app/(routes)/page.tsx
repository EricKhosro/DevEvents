import ExploreBtn from "@/components/ExploreBtn";
import Link from "next/link";
import CachedEvents from "./Events";
import { getSafeUserInfo } from "@/server/modules/user/user.action";
import { Role } from "@/shared/constants/constant";
import { AdminPendingFilterToggle } from "@/components/events/AdminPendingFilterToggle";

interface PageProps {
  searchParams: Promise<{ pending?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { pending } = await searchParams;
  // const user = await getSafeUserInfo();
  // const isAdmin = !!user && user.role === Role.Admin;
  // const pendingOnly = isAdmin && pending === "true";

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="mt-5 text-center">
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

      {/* {isAdmin && <AdminPendingFilterToggle />} */}

      <CachedEvents pendingOnly={false} />
    </section>
  );
};

export default Page;
