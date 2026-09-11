"use client";
import { QuizQuestion } from "@/lib/quiz";
import { useEffect, useState } from "react";

interface QuestionCardProps { question: QuizQuestion; questionNumber: number; totalQuestions: number; onAnswer: (answer: string) => void; }
export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => setSelected(null), [question.id]);
  return <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#151515] shadow-2xl shadow-black/60"><div className="p-6 sm:p-9">
    <div className="mb-7 flex items-center justify-between text-xs font-bold uppercase tracking-[.16em] text-zinc-500"><span>Round {questionNumber} of {totalQuestions}</span><span className="text-[#1ed760]">{Math.round(questionNumber / totalQuestions * 100)}%</span></div>
    <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#1ed760] transition-all" style={{ width: `${questionNumber / totalQuestions * 100}%` }} /></div>
    <div className="flex items-center gap-4 border-y border-white/10 py-5"><img src={question.track.albumArt} alt="" className="h-16 w-16 rounded-xl object-cover shadow-lg" /><div><p className="font-black">{question.track.name}</p><p className="mt-1 text-sm text-zinc-500">{question.track.artist}</p></div></div>
    <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[#1ed760]">{question.type === "artist" ? "Artist check" : "Popularity radar"}</p><h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{question.prompt}</h1>
    <div className="mt-8 grid gap-3">{question.options.map((option, index) => <button key={option} onClick={() => setSelected(option)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left text-sm font-bold transition ${selected === option ? "border-[#1ed760] bg-[#1ed760] text-black" : "border-white/10 bg-white/[.035] text-zinc-300 hover:border-white/30 hover:bg-white/[.08]"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${selected === option ? "bg-black text-[#1ed760]" : "bg-white/10 text-zinc-400"}`}>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
    <button disabled={!selected} onClick={() => selected && onAnswer(selected)} className="mt-7 w-full rounded-full bg-[#1ed760] py-4 font-black text-black transition hover:bg-[#42eb7d] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500">{questionNumber === totalQuestions ? "See my result" : "Lock in answer"}</button>
  </div></div>;
}
