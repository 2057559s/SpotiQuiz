"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { type Track, generateDailyQuizQuestions, generateQuizQuestions, type QuizQuestion, themeForDate } from "@/lib/quiz";
import { type AnswerRecord, saveAnswerHistory } from "@/lib/history";
import { saveRound } from "@/lib/player";
import QuestionCard from "./QuestionCard";
import ResultsCard from "./ResultsCard";

interface QuizComponentProps { tracks: Track[]; recent?: Track[]; userKey: string; }
type Mode = "daily" | "free";
type Confidence = "wild" | "maybe" | "sure";
const confidencePoints: Record<Confidence, number> = { wild: 1, maybe: 2, sure: 3 };

const tasteRead = (score: number, total: number) => {
  const percentage = total ? score / total : 0;
  if (percentage >= 0.85) return "You know your listening habits at fingerprint level. Your library has no secrets.";
  if (percentage >= 0.6) return "You have strong musical recall — but your taste still knows how to surprise you.";
  return "Your library is bigger than your memory. That makes the next round more interesting.";
};

export default function QuizComponent({ tracks, recent = [], userKey }: QuizComponentProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [mode, setMode] = useState<Mode>("daily");
  const today = new Date().toISOString().slice(0, 10);
  const theme = themeForDate(today);
  const totalPoints = questions.length * 3;

  const startQuiz = (nextMode: Mode = mode) => {
    setMode(nextMode);
    setQuestions(nextMode === "daily" ? generateDailyQuizQuestions(tracks, today, 5, recent) : generateQuizQuestions(tracks, 10, recent));
    setCurrentIndex(0); setScore(0); setStarted(true); setComplete(false);
  };

  const handleAnswer = (answer: string, confidence: Confidence, usedClue: boolean) => {
    const question = questions[currentIndex];
    const isCorrect = answer === question.correctAnswer;
    const earned = isCorrect ? Math.max(1, confidencePoints[confidence] - (usedClue ? 1 : 0)) : 0;
    const nextScore = score + earned;
    const record: AnswerRecord = { id: `${question.id}-${Date.now()}`, question: question.prompt, track: question.track.name, artist: question.track.artist, albumArt: question.track.albumArt, answer, correctAnswer: question.correctAnswer, isCorrect, createdAt: new Date().toISOString() };
    saveAnswerHistory(userKey, [record]);
    if (isCorrect) setScore(nextScore);
    if (currentIndex < questions.length - 1) setCurrentIndex((value) => value + 1);
    else {
      saveRound(userKey, { id: `${mode}-${today}-${Date.now()}`, date: today, mode, score: nextScore, total: totalPoints, completedAt: new Date().toISOString() });
      setComplete(true);
    }
  };

  const shell = (content: ReactNode) => <main className="min-h-screen bg-[#070707] text-white"><header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6"><Link href="/" className="text-lg font-black tracking-tight"><span className="text-[#1ed760]">spoti</span>quiz</Link><div className="flex gap-2"><Link href="/dashboard" className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-zinc-300 sm:px-4 sm:text-sm">Dashboard</Link><Link href="/listening" className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-zinc-300 sm:px-4 sm:text-sm">Listening</Link></div></header>{content}</main>;
  if (!started) return shell(<section className="mx-auto grid max-w-5xl gap-5 px-6 py-12 md:grid-cols-2"><div className="rounded-[2rem] border border-[#1ed760]/30 bg-[#1ed760] p-8 text-black"><p className="text-xs font-black uppercase tracking-[.2em]">Today&apos;s challenge · {theme.name}</p><h1 className="mt-4 text-5xl font-black leading-[.9] tracking-tight">Five tracks.<br />No easy cues.</h1><p className="mt-5 max-w-sm text-sm font-medium opacity-70">{theme.detail} Artist names disappear, confidence changes the score, and a clue costs a point.</p><button onClick={() => startQuiz("daily")} className="mt-9 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white">Play daily challenge</button></div><div className="rounded-[2rem] border border-white/10 bg-[#151515] p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#1ed760]">Free play</p><h2 className="mt-4 text-3xl font-black">Ten questions. Four game modes.</h2><p className="mt-4 text-zinc-400">Artist blackouts, blurred cover clues, rank battles and recency rewinds — built from your Spotify taste.</p><button onClick={() => startQuiz("free")} className="mt-9 rounded-full border border-white/20 px-6 py-3.5 text-sm font-black hover:bg-white/10">Start free play</button><div className="mt-10 border-t border-white/10 pt-5 text-sm text-zinc-500">{tracks.length} top tracks · {recent.length} recent plays · <Link href="/dashboard" className="font-bold text-[#1ed760]">See your progress</Link></div></div></section>);
  if (complete) return <ResultsCard score={score} total={totalPoints} mode={mode} insight={tasteRead(score, totalPoints)} onRetry={() => startQuiz(mode)} onBack={() => setStarted(false)} />;
  return shell(<div className="mx-auto max-w-2xl px-5 py-8 sm:py-14"><QuestionCard question={questions[currentIndex]} questionNumber={currentIndex + 1} totalQuestions={questions.length} onAnswer={handleAnswer} /></div>);
}
