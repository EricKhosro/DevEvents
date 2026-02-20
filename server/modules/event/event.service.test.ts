import { Role } from "@/shared/constants/constant";
import type { IEvent } from "@/shared/types/event.types";

jest.mock("mongoose", () => ({
  Types: {
    ObjectId: class MockObjectId {},
  },
}));

jest.mock("./event.repository", () => ({
  __esModule: true,
  EventRepository: {
    findMany: jest.fn(),
  },
}));

jest.mock("../user/user.action", () => ({
  __esModule: true,
  getSafeUserInfo: jest.fn(),
}));

describe("EventService", () => {
  const { EventRepository } = jest.requireMock(
    "./event.repository"
  ) as {
    EventRepository: { findMany: jest.Mock };
  };

  beforeEach(() => {
    EventRepository.findMany.mockReset();
    EventRepository.findMany.mockResolvedValue([] as IEvent[]);
  });

  it("returns approved-only events for guests", async () => {
    const { EventService } = await import("./event.service");

    await EventService.fetchVisibleEvents(null);

    expect(EventRepository.findMany).toHaveBeenCalledWith({ approved: true });
  });

  it("returns all events for admin", async () => {
    const { EventService } = await import("./event.service");

    await EventService.fetchVisibleEvents({
      _id: "admin-1",
      role: Role.Admin,
    } as any);

    expect(EventRepository.findMany).toHaveBeenCalledWith({});
  });

  it("returns approved or createdBy for non-admin", async () => {
    const { EventService } = await import("./event.service");
    const userId = "user-1";

    await EventService.fetchVisibleEvents({
      _id: userId,
      role: Role.User,
    } as any);

    expect(EventRepository.findMany).toHaveBeenCalledWith({
      $or: [{ approved: true }, { createdBy: userId }],
    });
  });

  it("sanitizes slugs by trimming and lowercasing", async () => {
    const { EventService } = await import("./event.service");

    expect(EventService.sanitizeSlug("  Hello World  ")).toBe("hello world");
  });
});
