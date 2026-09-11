import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { signInMock, signOutMock, useSessionMock } = vi.hoisted(() => ({ signInMock: vi.fn(), signOutMock: vi.fn(), useSessionMock: vi.fn() }));
vi.mock("next-auth/react", () => ({ signIn: signInMock, signOut: signOutMock, useSession: useSessionMock }));

import ProfilePage from "./page";

describe("ProfilePage reconnect", () => {
  beforeEach(() => {
    signInMock.mockReset(); signOutMock.mockReset();
    signInMock.mockResolvedValue(undefined); signOutMock.mockResolvedValue(undefined);
  });

  it("does not automatically start another OAuth attempt for an unauthenticated visitor", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<ProfilePage />);
    expect(screen.getByRole("button", { name: "Connect Spotify" })).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("clears the stale session before requesting the complete Spotify grant", async () => {
    useSessionMock.mockReturnValue({ data: { user: { name: "Listener", email: "listener@example.com" } }, status: "authenticated" });
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: "Reconnect Spotify" }));
    await waitFor(() => expect(signInMock).toHaveBeenCalled());
    expect(signOutMock).toHaveBeenCalledWith({ redirect: false });
    expect(signInMock).toHaveBeenCalledWith("spotify", { callbackUrl: "/profile" }, { scope: expect.stringContaining("user-library-read"), show_dialog: "true" });
    expect(signOutMock.mock.invocationCallOrder[0]).toBeLessThan(signInMock.mock.invocationCallOrder[0]);
  });
});
