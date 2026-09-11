"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import QuizComponent from "@/components/QuizComponent";
import { Track } from "@/lib/quiz";

export default function QuizPage() {
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [recent, setRecent] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
      return;
    }

    if (status === "authenticated" && session?.user?.accessToken) {
      fetchTracks();
    }
  }, [status, session]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/spotify/top-tracks");
      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const data = await response.json();
      setTracks(data.tracks || []);
      setRecent(data.recent || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your music data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-black flex items-center justify-center p-4">
        <div className="bg-red-500 text-white p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchTracks}
            className="mt-4 bg-white text-red-500 px-4 py-2 rounded font-bold hover:bg-gray-100"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tracks.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No tracks found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find any tracks in your Spotify history. Listen to some music and try again!
          </p>
          <button
            onClick={fetchTracks}
            className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <QuizComponent tracks={tracks} recent={recent} userKey={session?.user?.email || session?.user?.name || "spotify-player"} />;
}
