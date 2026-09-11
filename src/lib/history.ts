export interface AnswerRecord {
  id: string;
  question: string;
  track: string;
  artist: string;
  albumArt: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  createdAt: string;
}

const key = (userKey: string) => `spotiquiz:answers:${userKey}`;

export const readAnswerHistory = (userKey: string): AnswerRecord[] => {
  if (typeof window === "undefined") return [];
  try { const value = JSON.parse(localStorage.getItem(key(userKey)) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
};

export const saveAnswerHistory = (userKey: string, records: AnswerRecord[]) => {
  if (typeof window !== "undefined") localStorage.setItem(key(userKey), JSON.stringify([...records, ...readAnswerHistory(userKey)].slice(0, 200)));
};
