import { fireEvent, render, screen } from "@testing-library/react";
import Tabbox from "./Tabbox";

describe("Tabbox", () => {
  it("calls onChange with the clicked tab index", () => {
    const onChange = jest.fn();
    render(
      <Tabbox
        activeTab={0}
        onChange={onChange}
        tabs={[
          { title: "Upcoming", index: 0 },
          { title: "Past", index: 1 },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Past"));

    expect(onChange).toHaveBeenCalledWith(1);
  });
});
