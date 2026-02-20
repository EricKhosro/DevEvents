import { fireEvent, render, screen } from "@testing-library/react";
import StaticDropdown from "./StaticDropdown";

describe("StaticDropdown", () => {
  it("renders label and options", () => {
    const changeHandler = jest.fn();
    render(
      <StaticDropdown
        label="Mode"
        name="mode"
        value=""
        onChange={changeHandler}
        options={[
          { label: "Online", value: "online" },
          { label: "In-person", value: "in-person" },
        ]}
      />
    );

    expect(screen.getByText("Mode")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("In-person")).toBeInTheDocument();
  });

  it("calls onChange when selection changes", () => {
    const changeHandler = jest.fn();
    render(
      <StaticDropdown
        label="Mode"
        name="mode"
        value=""
        onChange={changeHandler}
        options={[
          { label: "Online", value: "online" },
          { label: "In-person", value: "in-person" },
        ]}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { name: "mode", value: "online" },
    });

    expect(changeHandler).toHaveBeenCalledWith("mode", "online");
  });
});
