"use client";

import type { QuizQuestion } from "@/lib/quiz";
import { useEffect, useState } from "react";

type Confidence = "wild" | "maybe" | "sure";
interface QuestionCardProps { question: QuizQuestion; questionNumber: number; totalQuestions: number; onAnswer: (answer: string, confidence: Confidence, usedClue: boolean) => void; }
const modeLabel = { artist: "Artist blackout", cover: "Cover clue", rank: "Rank battle", recency: "Recency rewind" };

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<Confidence>("maybe");
  const [usedClue, setUsedClue] = useState(false);
  const pairedTracks = question.comparison ? [question.track, question.comparison] : [question.track];
  const hidesArtist = question.type === "artist" || question.type === "cover";

  useEffect(() => {
    setSelected(null);
    setConfidence("maybe");
    setUsedClue(false);
  }, [question.id]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#151515] shadow-2xl shadow-black/60">
      <div className="p-6 sm:p-9">
        <div className="mb-7 flex items-center justify-between text-xs font-bold uppercase tracking-[.16em] text-zinc-500">
          <span>Round {questionNumber} of {totalQuestions}</span>
          <span className="text-[#1ed760]">{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#1ed760] transition-all" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} /></div>
        <div className={`grid gap-3 border-y border-white/10 py-5 ${pairedTracks.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {pairedTracks.map((track) => (
            <div key={track.id} className="flex min-w-0 items-center gap-4">
              <img src={track.albumArt} alt="" className={`h-16 w-16 shrink-0 rounded-xl object-cover shadow-lg ${question.type === "cover" && !usedClue ? "blur-md" : ""}`} />
              <div className="min-w-0"><p className="truncate font-black">{track.name}</p><p className="mt-1 truncate text-sm text-zinc-500">{hidesArtist ? "Artist hidden" : track.artist}</p></div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[#1ed760]">{modeLabel[question.type]}</p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{question.prompt}</h1>
        {question.type === "cover" && !usedClue ? <button onClick={() => setUsedClue(true)} className="mt-5 rounded-full border border-[#1ed760]/40 px-4 py-2 text-sm font-bold text-[#1ed760] hover:bg-[#1ed760]/10">Reveal a clue (−1 point)</button> : null}
        {question.type === "cover" && usedClue ? <p className="mt-5 rounded-xl bg-[#1ed760]/10 p-3 text-sm font-bold text-[#79f29f]">{question.clue}</p> : null}
        <div className="mt-8 grid gap-3">
          {question.options.map((option, index) => (
            <button key={option} onClick={() => setSelected(option)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left text-sm font-bold transition ${selected === option ? "border-[#1ed760] bg-[#1ed760] text-black" : "border-white/10 bg-white/[.035] text-zinc-300 hover:border-white/30 hover:bg-white/[.08]"}`}>
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${selected === option ? "bg-black text-[#1ed760]" : "bg-white/10 text-zinc-400"}`}>{String.fromCharCode(65 + index)}</span>{option}
            </button>
          ))}
        </div>
        {selected ? <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-zinc-500">How sure are you?</p><div className="mt-3 grid grid-cols-3 gap-2">{(["wild", "maybe", "sure"] as Confidence[]).map((level) => <button key={level} onClick={() => setConfidence(level)} aria-pressed={confidence === level} className={`rounded-xl border px-2 py-3 text-xs font-black capitalize ${confidence === level ? "border-[#1ed760] bg-[#1ed760] text-black" : "border-white/10 text-zinc-400"}`}>{level === "wild" ? "Wild · 1×" : level === "maybe" ? "Maybe · 2×" : "Sure · 3×"}</button>)}</div></div> : null}
        <button disabled={!selected} onClick={() => selected && onAnswer(selected, confidence, usedClue)} className="mt-7 w-full rounded-full bg-[#1ed760] py-4 font-black text-black transition hover:bg-[#42eb7d] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500">{questionNumber === totalQuestions ? "See my result" : "Lock in answer"}</button>
      </div>
    </div>
  );
}
