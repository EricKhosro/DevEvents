import { requireAuth } from "@/server/modules/user/user.action";
import CreateEvent from "./CreateEvent";

const Page = async () => {
  await requireAuth();

  return <CreateEvent />;
};

export default Page;
