import createHttpError from "http-errors";
import { errorHandler } from "./errorHandler";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: unknown) => ({ body, init })),
  },
}));

describe("errorHandler", () => {
  const jsonMock = NextResponse.json as jest.Mock;

  beforeEach(() => {
    jsonMock.mockClear();
  });

  it("returns HttpError responses with status", () => {
    const error = createHttpError(404, "Not Found");

    const result = errorHandler(error);

    expect(jsonMock).toHaveBeenCalledWith(
      { message: "Not Found" },
      { status: 404 }
    );
    expect(result).toEqual({
      body: { message: "Not Found" },
      init: { status: 404 },
    });
  });

  it("handles generic Error as 500", () => {
    errorHandler(new Error("Boom"));

    expect(jsonMock).toHaveBeenCalledWith(
      { message: "Boom" },
      { status: 500 }
    );
  });

  it("handles unknown errors as 500 with default message", () => {
    errorHandler("bad");

    expect(jsonMock).toHaveBeenCalledWith(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  });
});
