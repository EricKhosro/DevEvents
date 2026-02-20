import { render, screen } from "@testing-library/react";
import Page from "./page";

jest.mock("./Events", () => ({
  __esModule: true,
  default: () => <div data-testid="events" />,
}));

describe("Home Page", () => {
  it("checks page renders", async () => {
    const ui = await Page();
    render(ui);

    expect(
      screen.getByRole("heading", { name: /The Hub for Every Dev/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "One Piece" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Explore Events/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("events")).toBeInTheDocument();
  });
});
