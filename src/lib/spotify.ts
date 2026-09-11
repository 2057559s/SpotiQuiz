import { useSession } from "next-auth/react";

const SPOTIFY_API = "https://api.spotify.com/v1";

export const useSpotifyAPI = () => {
  const { data: session } = useSession();

  const fetchSpotifyData = async (endpoint: string) => {
    if (!session?.user?.accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(`${SPOTIFY_API}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  };

  const getTopTracks = async (limit: number = 50, timeRange: string = "medium_term") => {
    return fetchSpotifyData(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`);
  };

  const getTopArtists = async (limit: number = 50, timeRange: string = "medium_term") => {
    return fetchSpotifyData(`/me/top/artists?limit=${limit}&time_range=${timeRange}`);
  };

  const getCurrentUser = async () => {
    return fetchSpotifyData("/me");
  };

  return { fetchSpotifyData, getTopTracks, getTopArtists, getCurrentUser };
};
