"use client";

import Link from "next/link";

interface ResultsCardProps { score: number; total: number; mode: "daily" | "free"; insight?: string; onRetry: () => void; onBack: () => void; }

export default function ResultsCard({ score, total, mode, insight, onRetry, onBack }: ResultsCardProps) {
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const label = percentage >= 80 ? "Taste-maker" : percentage >= 50 ? "Deep listener" : "Fresh ears";
  const share = async () => {
    const text = `I scored ${score}/${total} points (${percentage}%) on today’s Spotiquiz ${mode === "daily" ? "Daily Challenge" : "round"}. Think you can beat me?`;
    if (navigator.share) await navigator.share({ title: "Spotiquiz", text }); else await navigator.clipboard.writeText(text);
  };
  return <main className="grid min-h-screen place-items-center bg-[#070707] px-5 text-white"><section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#151515] p-8 text-center shadow-2xl shadow-black"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#1ed760]">{mode === "daily" ? "Daily challenge complete" : "Round complete"}</p><h1 className="mt-3 text-4xl font-black tracking-tight">{label}</h1><div className="mx-auto my-8 grid h-40 w-40 place-items-center rounded-full border-[10px] border-[#1ed760] bg-[#0b0b0b]"><div><p className="text-5xl font-black">{score}</p><p className="text-xs font-bold uppercase tracking-widest text-zinc-500">of {total} points</p></div></div><p className="text-zinc-400">{percentage}% point accuracy. Your answers are already saved.</p>{insight && <div className="mt-6 rounded-2xl border border-[#1ed760]/25 bg-[#1ed760]/10 p-4 text-left"><p className="text-xs font-black uppercase tracking-[.16em] text-[#1ed760]">Your taste read</p><p className="mt-2 text-sm font-medium text-zinc-200">{insight}</p></div>}<div className="mt-8 grid gap-3"><button onClick={share} className="rounded-full bg-[#1ed760] py-3.5 font-black text-black">Share result</button><button onClick={onRetry} className="rounded-full border border-white/15 py-3.5 text-sm font-bold">Play another round</button><Link href="/dashboard" className="text-sm font-bold text-[#1ed760]">View your dashboard</Link><button onClick={onBack} className="text-sm font-bold text-zinc-500 hover:text-white">Back to music</button></div></section></main>;
}
