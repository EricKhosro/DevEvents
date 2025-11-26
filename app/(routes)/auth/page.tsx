"use client";

import Button from "@/components/base/Button";
import Tabbox from "@/components/base/Tabbox";
import TextInput from "@/components/base/TextInput";
import { IAuthDTO } from "@/shared/types/auth.types";
import { ITab } from "@/shared/types/components.types";
import { useState } from "react";

enum ActiveTab {
  Signup,
  Signin,
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState(ActiveTab.Signin);
  const [formValues, setFormValues] = useState({} as IAuthDTO);

  const tabs: ITab[] = [
    {
      index: ActiveTab.Signup,
      title: "Signup",
    },
    {
      index: ActiveTab.Signin,
      title: "Signin",
    },
  ];

  const changeHandler = (name: string, value: any) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const submitHandler = () => {};

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
        />
        <Button
          onClick={submitHandler}
          text={activeTab === ActiveTab.Signin ? "Signin" : "Signup"}
        />
      </form>
    </div>
  );
};

export default Auth;
