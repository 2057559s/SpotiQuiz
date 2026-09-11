"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

const spotifyScopes = "user-read-email user-read-private user-top-read user-read-recently-played streaming user-modify-playback-state user-read-playback-state user-library-read playlist-read-private";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [reconnecting, setReconnecting] = useState(false);
  const reconnect = async () => {
    setReconnecting(true);
    // Signing in over an existing JWT can preserve the older Spotify grant.
    // Clear it first, then request the complete scope list explicitly.
    await signOut({ redirect: false });
    await signIn("spotify", { callbackUrl: "/profile" }, { scope: spotifyScopes, show_dialog: "true" });
  };

  if (status === "loading") return <main className="grid min-h-screen place-items-center bg-[#070707]"><span className="h-8 w-8 animate-spin rounded-full border-2 border-[#1ed760] border-t-transparent" /></main>;
  if (status === "unauthenticated") return <main className="grid min-h-screen place-items-center bg-[#070707] px-5 text-white"><section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#151515] p-8 text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#1ed760]">Spotify connection</p><h1 className="mt-3 text-3xl font-black">Connect your account</h1><p className="mt-4 text-sm leading-relaxed text-zinc-400">Approve access to your top tracks, playlists, and Liked Songs to personalise Spotiquiz.</p><button onClick={() => signIn("spotify", { callbackUrl: "/profile" }, { scope: spotifyScopes, show_dialog: "true" })} className="mt-7 rounded-full bg-[#1ed760] px-6 py-3.5 text-sm font-black text-black">Connect Spotify</button><Link href="/" className="mt-5 block text-sm font-bold text-zinc-500">Back home</Link></section></main>;
  return <main className="grid min-h-screen place-items-center bg-[#070707] px-5 text-white"><section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#151515] p-8"><Link href="/" className="text-sm font-bold text-[#1ed760]">← Home</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.2em] text-[#1ed760]">Your account</p><div className="mt-4 flex items-center gap-4">{session?.user?.image ? <img src={session.user.image} alt="" className="h-16 w-16 rounded-full" /> : <div className="h-16 w-16 rounded-full bg-[#1ed760]" />}<div><h1 className="text-2xl font-black">{session?.user?.name || "Spotify listener"}</h1><p className="text-sm text-zinc-500">{session?.user?.email}</p></div></div><div className="mt-9 space-y-3 border-y border-white/10 py-6 text-sm text-zinc-400"><p>✓ Spotify profile connected</p><p>✓ Top tracks, playlists, and Liked Songs requested</p><p>✓ Your quiz history stays on this device</p></div><div className="mt-7 grid gap-3"><button disabled={reconnecting} onClick={reconnect} className="rounded-full border border-white/20 py-3.5 text-sm font-bold disabled:opacity-60">{reconnecting ? "Reconnecting…" : "Reconnect Spotify"}</button><button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full py-3.5 text-sm font-bold text-zinc-500 hover:text-white">Sign out</button></div></section></main>;
}
