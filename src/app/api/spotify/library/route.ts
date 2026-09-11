import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
const api = "https://api.spotify.com/v1";

export async function GET() {
  const session = await getServerSession(authOptions); const token = session?.user?.accessToken;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const [savedResponse, playlistsResponse] = await Promise.all([fetch(`${api}/me/tracks?limit=50`, { headers, cache: "no-store" }), fetch(`${api}/me/playlists?limit=50`, { headers, cache: "no-store" })]);
    if (!savedResponse.ok) {
      const detail = await savedResponse.json().catch(() => null);
      return NextResponse.json({ error: detail?.error?.message || "Spotify did not grant access to your Liked Songs. Reconnect your Spotify account and approve access to your library.", needsReconnect: savedResponse.status === 401 || savedResponse.status === 403 }, { status: savedResponse.status === 401 || savedResponse.status === 403 ? 403 : 502 });
    }
    const savedData = await savedResponse.json(); const playlistsData = playlistsResponse.ok ? await playlistsResponse.json() : { items: [] };
    const tracks = (Array.isArray(savedData.items) ? savedData.items : []).filter((item: any) => item?.track?.id && item.track.uri).map((item: any) => ({ id: item.track.id, uri: item.track.uri, name: item.track.name || "Unknown track", artist: item.track.artists?.[0]?.name || "Unknown artist", art: item.track.album?.images?.[0]?.url || "" }));
    const playlists = (Array.isArray(playlistsData.items) ? playlistsData.items : []).filter((item: any) => item?.id && item.uri).map((item: any) => ({ id: item.id, uri: item.uri, name: item.name || "Untitled playlist", art: item.images?.[0]?.url || "", count: item.tracks?.total || 0 }));
    return NextResponse.json({ tracks, playlists });
  } catch { return NextResponse.json({ error: "Could not load your library" }, { status: 500 }); }
}
