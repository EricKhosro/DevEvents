import { JSX, MouseEvent } from "react";
import Loading from "./Loading";

interface IProps {
  text: string | JSX.Element;
  onClick: () => void;
  style?: "primary" | "transparent";
  loading?: boolean;
}

const Button = ({ onClick, style = "primary", text, loading }: IProps) => {
  const clickHandler = (e: MouseEvent) => {
    e.preventDefault();
    onClick();
  };
  let className;
  switch (style) {
    case "transparent":
      className =
        "inline-flex w-full cursor-pointer items-center justify-center rounded-[6px] border border-white/10 bg-white/10 px-2 py-1 text-base font-semibold text-light-100 leading-none backdrop-blur-xl transition hover:bg-white/20";
      break;

    case "primary":
    default:
      className =
        "inline-flex bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black leading-none";
  }
  return (
    <button className={className} onClick={clickHandler}>
      {loading ? <Loading /> : text}
    </button>
  );
};

export default Button;
