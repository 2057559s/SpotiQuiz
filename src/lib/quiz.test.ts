import { describe, expect, it } from "vitest";
import { generateDailyQuizQuestions, generateQuizQuestions, themeForDate, type Track } from "./quiz";

const tracks: Track[] = [
  { id: "1", name: "Midnight", artist: "Nova", artistId: "a1", albumArt: "", popularity: 22 },
  { id: "2", name: "Sunrise", artist: "Sol", artistId: "a2", albumArt: "", popularity: 47 },
  { id: "3", name: "Neon", artist: "Lumen", artistId: "a3", albumArt: "", popularity: 68 },
  { id: "4", name: "Stadium", artist: "Atlas", artistId: "a4", albumArt: "", popularity: 91 },
];
const recent = tracks.map((track, index) => ({ ...track, playedAt: `2026-09-10T0${index}:00:00.000Z` }));

describe("quiz generator", () => {
  it("limits rounds to available tracks and every question is answerable", () => {
    const questions = generateQuizQuestions(tracks, 10, recent);
    expect(questions).toHaveLength(tracks.length);
    questions.forEach((question) => expect(question.options).toContain(question.correctAnswer));
  });

  it("cycles through the hard game modes when listening data supports them", () => {
    const types = generateDailyQuizQuestions(tracks, "2026-09-10", 4, recent).map((question) => question.type);
    expect(types).toEqual(["artist", "cover", "rank", "recency"]);
  });

  it("makes rank and recency answers from the corresponding pair", () => {
    const questions = generateDailyQuizQuestions(tracks, "2026-09-10", 4, recent);
    const rank = questions.find((question) => question.type === "rank");
    const recency = questions.find((question) => question.type === "recency");
    expect(rank?.comparison).toBeDefined();
    expect(rank?.options).toHaveLength(2);
    expect(recency?.comparison).toBeDefined();
    expect(recency?.options).toHaveLength(2);
  });

  it("creates the same daily challenge and theme for the same date", () => {
    expect(generateDailyQuizQuestions(tracks, "2026-09-10", 4, recent)).toEqual(generateDailyQuizQuestions(tracks, "2026-09-10", 4, recent));
    expect(themeForDate("2026-09-10")).toEqual(themeForDate("2026-09-10"));
  });

  it("does not collide on dates whose digits merely add up to the same value", () => {
    expect(generateDailyQuizQuestions(tracks, "2026-09-12", 4, recent)).not.toEqual(generateDailyQuizQuestions(tracks, "2026-09-21", 4, recent));
  });

  it("falls back safely without recent listening data or varied artists", () => {
    const oneArtist = tracks.map((track) => ({ ...track, artist: "Nova" }));
    const questions = generateDailyQuizQuestions(oneArtist, "2026-09-10", 5);
    expect(questions.every((question) => question.options.includes(question.correctAnswer))).toBe(true);
    expect(questions.some((question) => question.type === "recency")).toBe(false);
  });
});
