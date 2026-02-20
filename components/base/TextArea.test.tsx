import { fireEvent, render, screen } from "@testing-library/react";
import TextArea from "./TextArea";

describe("TextArea", () => {
  it("renders label and placeholder", () => {
    const changeHandler = jest.fn();
    render(
      <TextArea
        label="Bio"
        name="bio"
        onChange={changeHandler}
        placeholder="Tell us about yourself"
        value="Hello"
      />
    );

    expect(screen.getByText("Bio")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tell us about yourself")
    ).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    const changeHandler = jest.fn();
    render(
      <TextArea
        label="Message"
        name="message"
        onChange={changeHandler}
        placeholder="Write a message"
        value=""
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Write a message"), {
      target: { name: "message", value: "Hello world" },
    });

    expect(changeHandler).toHaveBeenCalledWith("message", "Hello world");
  });
});
