"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Arcade from "@/components/Arcade";
import { Track } from "@/lib/quiz";

export default function ArcadePage() {
  const { status } = useSession();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { window.location.assign("/login"); return; }
    if (status !== "authenticated") return;
    fetch("/api/spotify/top-tracks")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Spotify request failed")))
      .then((data) => setTracks(Array.isArray(data.tracks) ? data.tracks : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) return <main className="grid min-h-screen place-items-center bg-[#070707]"><span className="h-9 w-9 animate-spin rounded-full border-2 border-[#1ed760] border-t-transparent" /></main>;
  if (status === "unauthenticated") return null;
  if (error || !tracks.length) return <main className="grid min-h-screen place-items-center bg-[#070707] px-5 text-white"><section className="max-w-md rounded-[2rem] border border-white/10 bg-[#151515] p-8 text-center"><h1 className="text-2xl font-black">The arcade needs a few tracks first.</h1><p className="mt-3 text-sm leading-relaxed text-zinc-400">{error ? "We couldn't reach Spotify just now." : "Spotify didn't return any top tracks for this account yet."}</p><div className="mt-7 flex justify-center gap-3"><button onClick={() => window.location.reload()} className="rounded-full bg-[#1ed760] px-5 py-3 text-sm font-black text-black">Try again</button><Link href="/quiz" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold">Classic quiz</Link></div></section></main>;
  return <main className="min-h-screen bg-[#070707]"><header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-white"><Link href="/" className="text-lg font-black"><span className="text-[#1ed760]">spoti</span>quiz</Link><Link href="/quiz" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold">Classic quiz</Link></header><Arcade tracks={tracks} /></main>;
}
