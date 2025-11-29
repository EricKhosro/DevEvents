"use client";

import Button from "@/components/base/Button";
import Tabbox from "@/components/base/Tabbox";
import TextInput from "@/components/base/TextInput";
import { IAuthDTO } from "@/shared/types/auth.types";
import { ITab } from "@/shared/types/components.types";
import { BaseUrl } from "@/shared/utils/env.utils";
import { useState } from "react";
import { signIn } from "next-auth/react";
import GithubButton from "@/components/GithubButton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

enum ActiveTab {
  Register,
  Login,
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState(ActiveTab.Login);
  const [formValues, setFormValues] = useState({} as IAuthDTO);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const tabs: ITab[] = [
    {
      index: ActiveTab.Register,
      title: "Register",
    },
    {
      index: ActiveTab.Login,
      title: "Login",
    },
  ];

  const changeHandler = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const authRequest = async () => {
    const response = await fetch(
      `${BaseUrl}/api/auth/${
        activeTab === ActiveTab.Login ? "signin" : "signup"
      }`,
      {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const status = response.status;
    const data = await response.json();
    if (status !== 200) throw Error(data.message);
    return data;
  };

  const submitHandler = async () => {
    setLoading(true);
    toast
      .promise(authRequest, {
        loading: activeTab === ActiveTab.Login ? "Logging-in..." : "Signing-in",
        success: ({ message }: { message: string }) => <b>{message}</b>,
        error: ({ message }: { message: string }) => <b>{message}</b>,
      })
      .then(() => {
        if (activeTab === ActiveTab.Login) router.push("/");
        else setActiveTab(ActiveTab.Login);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col justify-start items-center w-full md:w-xl mx-auto">
      <Tabbox tabs={tabs} onChange={setActiveTab} activeTab={activeTab} />
      <form className="mt-10 flex flex-col justify-start items-start gap-8 w-full px-5">
        <TextInput
          label="Email"
          name="email"
          onChange={changeHandler}
          placeholder="Enter your email"
          value={formValues.email}
        />
        <TextInput
          label="Password"
          name="password"
          onChange={changeHandler}
          placeholder="Enter your password"
          value={formValues.password}
          type="password"
        />
        {activeTab === ActiveTab.Register ? (
          <TextInput
            label="Re-Password"
            name="rePassword"
            onChange={changeHandler}
            placeholder="Enter repeat password"
            value={formValues.rePassword}
            type="password"
          />
        ) : (
          <></>
        )}
        <Button
          onClick={submitHandler}
          text={activeTab === ActiveTab.Login ? "Login" : "Register"}
          loading={loading}
        />
        <GithubButton
          onClick={() => {
            signIn("github");
          }}
        />
      </form>
    </div>
  );
};

export default Auth;
