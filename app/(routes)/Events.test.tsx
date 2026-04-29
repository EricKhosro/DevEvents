import { Role } from "@/shared/constants/constant";
import { IEvent } from "@/shared/types/event.types";
import { Types } from "mongoose";
import { render, screen } from "@testing-library/react";
import type { EventService as EventServiceType } from "@/server/modules/event/event.service";
import type { getSafeUserInfo as getSafeUserInfoType } from "@/server/modules/user/user.action";

jest.mock("@/server/modules/user/user.action", () => ({
  __esModule: true,
  getSafeUserInfo: jest.fn(),
}));

jest.mock("@/server/modules/event/event.service", () => ({
  __esModule: true,
  EventService: {
    fetchVisibleEvents: jest.fn(),
  },
}));

describe("Events", () => {
  const { EventService } = jest.requireMock(
    "@/server/modules/event/event.service",
  ) as {
    EventService: jest.Mocked<typeof EventServiceType>;
  };

  const { getSafeUserInfo } = jest.requireMock(
    "@/server/modules/user/user.action",
  ) as {
    getSafeUserInfo: jest.MockedFunction<typeof getSafeUserInfoType>;
  };

  const userOneId = new Types.ObjectId();
  const userTwoId = new Types.ObjectId();

  const mockedEvents: IEvent[] = [
    {
      title: "Event 1",
      slug: "event-1",
      description: "Event 1 description",
      overview: "Event 1 overview",
      image: "/x.png",
      venue: "Convention Center",
      location: "NYC",
      date: "2026-02-20",
      time: "10:00",
      mode: "In-person",
      audience: "Developers",
      agenda: ["Opening", "Keynote", "Networking"],
      organizer: "Dev Event Org",
      tags: ["dev", "conference"],
      createdAt: new Date("2026-02-01T10:00:00.000Z"),
      updatedAt: new Date("2026-02-10T10:00:00.000Z"),
      createdBy: {
        _id: userOneId,
        username: "nmai",
      },
      approved: true,
      deleted: false,
    },
    {
      title: "Event 2",
      slug: "event-2",
      description: "Event 2 description",
      overview: "Event 2 overview",
      image: "/x.png",
      venue: "Tech Hub",
      location: "NYC",
      date: "2026-02-20",
      time: "20:00",
      mode: "Virtual",
      audience: "Engineers",
      agenda: ["Intro", "Talks", "Q&A"],
      organizer: "Dev Event Org",
      tags: ["web", "meetup"],
      createdAt: new Date("2026-02-05T10:00:00.000Z"),
      updatedAt: new Date("2026-02-12T10:00:00.000Z"),
      createdBy: {
        _id: userTwoId,
        username: "luffy",
      },
      approved: true,
      deleted: false,
    },
  ];

  it("renders events for signed-in user", async () => {
    getSafeUserInfo.mockResolvedValue({
      _id: userOneId,
      email: "a@b.com",
      username: "joyboy",
      avatar: "",
      role: Role.User,
    });

    EventService.fetchVisibleEvents.mockResolvedValue(mockedEvents);

    const { default: Events } = await import("./Events");
    const ui = await Events();
    render(ui);

    const eventsHeader = screen.getByRole("heading", {
      level: 3,
      name: "Featured Events",
    });
    expect(eventsHeader).toBeInTheDocument();

    const eventsList = screen.getByRole("list");
    expect(eventsList).toBeInTheDocument();

    const eventsListItems = screen.getAllByRole("listitem");
    expect(eventsListItems).toHaveLength(mockedEvents.length);
  });
});
