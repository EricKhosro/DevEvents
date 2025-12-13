import { getUserInfo } from "@/server/modules/user/user.action";
import FormsWrapper from "./FormsWrapper";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  let user;

  try {
    user = await getUserInfo();
    if (user) redirect("/");
  } catch (error) {
    console.log(error);
  }

  return <FormsWrapper />;
};

export default AuthPage;
