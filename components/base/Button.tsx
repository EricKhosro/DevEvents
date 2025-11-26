import { JSX } from "react";

interface IProps {
  text: string | JSX.Element;
  onClick: () => void;
  style?: "primary";
}

const Button = ({ onClick, style = "primary", text }: IProps) => {
  return (
    <button className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black">
      {text}
    </button>
  );
};

export default Button;
