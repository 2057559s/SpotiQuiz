import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession, fetchMock } = vi.hoisted(() => ({ getServerSession: vi.fn(), fetchMock: vi.fn() }));
vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));

vi.stubGlobal("fetch", fetchMock);

import { GET } from "./route";

describe("GET /api/spotify/top-tracks", () => {
  beforeEach(() => { getServerSession.mockReset(); fetchMock.mockReset(); });

  it("rejects requests without a signed-in Spotify session", async () => {
    getServerSession.mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes Spotify top tracks and recent listening data", async () => {
    getServerSession.mockResolvedValue({ user: { accessToken: "token" } });
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ id: "track-1", name: "Midnight", artists: [{ name: "Nova", id: "artist-1" }], album: { images: [{ url: "cover.jpg" }] }, popularity: 61 }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ played_at: "2026-01-01", track: { id: "track-2", name: "Sunrise", artists: [{ name: "Sol", id: "artist-2" }], album: { images: [] }, popularity: 42 } }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ display_name: "Player", images: [{ url: "profile.jpg" }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ id: "track-3", name: "Evergreen", artists: [{ name: "Ivy", id: "artist-3" }], album: { images: [{ url: "evergreen.jpg" }] }, popularity: 55 }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ id: "artist-3", name: "Ivy", images: [{ url: "ivy.jpg" }], genres: ["indie pop", "pop"] }] }) });
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ tracks: [{ id: "track-1", name: "Midnight", artist: "Nova", artistId: "artist-1", albumArt: "cover.jpg", popularity: 61 }], recent: [{ id: "track-2", name: "Sunrise", artist: "Sol", artistId: "artist-2", albumArt: "", popularity: 42, playedAt: "2026-01-01" }], allTimeTracks: [{ id: "track-3", name: "Evergreen", artist: "Ivy", artistId: "artist-3", albumArt: "evergreen.jpg", popularity: 55 }], topArtists: [{ id: "artist-3", name: "Ivy", image: "ivy.jpg", genres: ["indie pop", "pop"] }], profile: { displayName: "Player", image: "profile.jpg" } });
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("returns a stable payload when optional Spotify sections fail or contain sparse records", async () => {
    getServerSession.mockResolvedValue({ user: { accessToken: "token" } });
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ id: "bare", name: "No artist" }, null] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ played_at: "2026-01-01", track: null }] }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ id: "artist", name: "Minimal" }] }) });
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ tracks: [{ id: "bare", name: "No artist", artist: "Unknown Artist", artistId: "", albumArt: "", popularity: 0 }, { id: "", name: "Unknown track", artist: "Unknown Artist", artistId: "", albumArt: "", popularity: 0 }], recent: [], allTimeTracks: [], topArtists: [{ id: "artist", name: "Minimal", image: "", genres: [] }], profile: null });
  });

  it("returns a safe error when the required top-track request fails", async () => {
    getServerSession.mockResolvedValue({ user: { accessToken: "token" } });
    fetchMock.mockResolvedValue({ ok: false, status: 429, text: async () => "rate limited" });
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await GET();
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Failed to fetch Spotify data" });
    error.mockRestore();
  });
});
