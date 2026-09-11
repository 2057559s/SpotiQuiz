"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const connect = async () => { setLoading(true); await signIn("spotify", { callbackUrl: "/" }); };
  return <main className="grid min-h-screen place-items-center overflow-hidden bg-[#070707] px-5 text-white"><div className="absolute h-[34rem] w-[34rem] rounded-full bg-[#1ed760]/20 blur-[140px]" /><section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-[#151515] p-8 shadow-2xl shadow-black sm:p-10"><Link href="/" className="flex items-center gap-2 text-lg font-black"><img src="/spotiquiz-logo.png" alt="Spotiquiz" className="h-9 w-9 rounded-lg object-cover" />spotiquiz</Link><p className="mt-12 text-xs font-bold uppercase tracking-[.2em] text-[#1ed760]">Your player account</p><h1 className="mt-3 text-4xl font-black tracking-tight">Connect your sound.</h1><p className="mt-4 leading-relaxed text-zinc-400">Your Spotify account is your Spotiquiz account. New here? This creates your profile; returning? It signs you straight in.</p><button onClick={connect} disabled={loading} className="mt-9 flex w-full items-center justify-center gap-3 rounded-full bg-[#1ed760] py-4 font-black text-black transition hover:bg-[#43ed7e] disabled:bg-zinc-600">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />Opening Spotify…</> : "Continue with Spotify"}</button><div className="mt-7 border-t border-white/10 pt-5 text-xs leading-relaxed text-zinc-500">We request your profile, top tracks, and recent listening activity. Spotiquiz never posts or edits your Spotify account.</div></section></main>;
}
