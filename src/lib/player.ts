export interface RoundRecord { id: string; date: string; mode: "daily" | "free"; score: number; total: number; completedAt: string; }
export interface PlayerProgress { rounds: RoundRecord[]; dailyDates: string[]; }

const key = (userKey: string) => `spotiquiz:player:${userKey}`;
const empty = (): PlayerProgress => ({ rounds: [], dailyDates: [] });
export const readPlayerProgress = (userKey: string): PlayerProgress => {
  if (typeof window === "undefined") return empty();
  try {
    const value = JSON.parse(localStorage.getItem(key(userKey)) || "{}");
    if (!value || typeof value !== "object") return empty();
    return { rounds: Array.isArray(value.rounds) ? value.rounds : [], dailyDates: Array.isArray(value.dailyDates) ? value.dailyDates : [] };
  } catch { return empty(); }
};
export const saveRound = (userKey: string, round: RoundRecord) => {
  if (typeof window === "undefined") return;
  const progress = readPlayerProgress(userKey);
  const dailyDates = round.mode === "daily" && !progress.dailyDates.includes(round.date) ? [round.date, ...progress.dailyDates] : progress.dailyDates;
  localStorage.setItem(key(userKey), JSON.stringify({ rounds: [round, ...progress.rounds].slice(0, 100), dailyDates }));
};
export const currentStreak = (dailyDates: string[]) => {
  const completed = new Set(dailyDates); let streak = 0; const cursor = new Date();
  while (completed.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
};
export const achievementsFor = (progress: PlayerProgress, correctAnswers: number) => [
  { name: "First spin", detail: "Complete your first round", unlocked: progress.rounds.length >= 1 },
  { name: "Three-day run", detail: "Finish three daily challenges", unlocked: currentStreak(progress.dailyDates) >= 3 },
  { name: "Taste-maker", detail: "Score 100% in a round", unlocked: progress.rounds.some((round) => round.score === round.total) },
  { name: "Music scholar", detail: "Get 50 answers right", unlocked: correctAnswers >= 50 },
];
