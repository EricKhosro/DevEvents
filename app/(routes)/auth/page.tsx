import { getUserInfo } from "@/server/modules/user/user.action";
import FormsWrapper from "./FormsWrapper";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  const user = await getUserInfo();
  if (user) redirect("/");

  return <FormsWrapper />;
};

export default AuthPage;
