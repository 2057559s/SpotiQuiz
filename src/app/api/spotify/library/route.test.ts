import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession, fetchMock } = vi.hoisted(() => ({ getServerSession: vi.fn(), fetchMock: vi.fn() }));
vi.mock("next-auth", () => ({ getServerSession }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.stubGlobal("fetch", fetchMock);

import { GET } from "./route";

describe("GET /api/spotify/library", () => {
  beforeEach(() => { getServerSession.mockReset(); fetchMock.mockReset(); });

  it("requires an authenticated Spotify token", async () => {
    getServerSession.mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns the user's Liked Songs and playlists", async () => {
    getServerSession.mockResolvedValue({ user: { accessToken: "token" } });
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ track: { id: "song-1", uri: "spotify:track:song-1", name: "Favourite", artists: [{ name: "Artist" }], album: { images: [{ url: "cover.jpg" }] } } }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ id: "playlist-1", uri: "spotify:playlist:playlist-1", name: "Road trip", images: [{ url: "playlist.jpg" }], tracks: { total: 12 } }] }) });
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ tracks: [{ id: "song-1", uri: "spotify:track:song-1", name: "Favourite", artist: "Artist", art: "cover.jpg" }], playlists: [{ id: "playlist-1", uri: "spotify:playlist:playlist-1", name: "Road trip", art: "playlist.jpg", count: 12 }] });
  });

  it("makes a missing library scope actionable instead of claiming the library is empty", async () => {
    getServerSession.mockResolvedValue({ user: { accessToken: "token" } });
    fetchMock
      .mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({ error: { message: "Insufficient client scope" } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) });
    const response = await GET();
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Insufficient client scope", needsReconnect: true });
  });

  it("skips malformed Spotify records instead of failing the full library response", async () => {
    getServerSession.mockResolvedValue({ user: { accessToken: "token" } });
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [{ track: null }, { track: { id: "song", uri: "spotify:track:song", artists: [] } }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [null, { id: "list", uri: "spotify:playlist:list", images: [] }] }) });
    const response = await GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ tracks: [{ id: "song", uri: "spotify:track:song", name: "Unknown track", artist: "Unknown artist", art: "" }], playlists: [{ id: "list", uri: "spotify:playlist:list", name: "Untitled playlist", art: "", count: 0 }] });
  });
});
