import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const SPOTIFY_API = "https://api.spotify.com/v1";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = (session.user as any).accessToken;
    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const [tracksResponse, recentResponse, profileResponse, allTimeTracksResponse, allTimeArtistsResponse] = await Promise.all([
      fetch(`${SPOTIFY_API}/me/top/tracks?limit=50&time_range=medium_term`, {
        headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store",
      }),
      fetch(`${SPOTIFY_API}/me/player/recently-played?limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store",
      }),
      fetch(`${SPOTIFY_API}/me`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }),
      fetch(`${SPOTIFY_API}/me/top/tracks?limit=10&time_range=long_term`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }),
      fetch(`${SPOTIFY_API}/me/top/artists?limit=10&time_range=long_term`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }),
    ]);

    if (!tracksResponse.ok) {
      const detail = await tracksResponse.text();
      throw new Error(`Spotify request failed: ${tracksResponse.status} ${detail}`);
    }

    const data = await tracksResponse.json();
    const recentData = recentResponse.ok ? await recentResponse.json() : { items: [] };
    const profileData = profileResponse.ok ? await profileResponse.json() : null;
    const allTimeTracksData = allTimeTracksResponse.ok ? await allTimeTracksResponse.json() : { items: [] };
    const allTimeArtistsData = allTimeArtistsResponse.ok ? await allTimeArtistsResponse.json() : { items: [] };

    const normalizeTrack = (item: any) => ({
      id: item?.id || "",
      name: item?.name || "Unknown track",
      artist: item?.artists?.[0]?.name || "Unknown Artist",
      artistId: item?.artists?.[0]?.id || "",
      albumArt: item?.album?.images?.[0]?.url || "",
      popularity: item?.popularity || 0,
    });

    const tracks = (Array.isArray(data.items) ? data.items : []).map(normalizeTrack);
    const recent = (Array.isArray(recentData.items) ? recentData.items : []).filter((item: any) => item?.track).map((item: any) => ({ ...normalizeTrack(item.track), playedAt: item.played_at }));
    const allTimeTracks = (Array.isArray(allTimeTracksData.items) ? allTimeTracksData.items : []).map(normalizeTrack);
    const topArtists = (Array.isArray(allTimeArtistsData.items) ? allTimeArtistsData.items : []).map((artist: any) => ({ id: artist?.id || "", name: artist?.name || "Unknown artist", image: artist?.images?.[0]?.url || "", genres: artist?.genres?.slice(0, 2) || [] }));

    return NextResponse.json({
      tracks,
      recent,
      allTimeTracks,
      topArtists,
      profile: profileData ? { displayName: profileData.display_name, image: profileData.images?.[0]?.url } : null,
    });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Spotify data" },
      { status: 500 }
    );
  }
}
