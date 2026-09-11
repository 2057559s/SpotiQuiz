import { describe, expect, it } from "vitest";
import { generateDailyQuizQuestions, generateQuizQuestions, Track } from "./quiz";

const tracks: Track[] = [
  { id: "1", name: "Midnight", artist: "Nova", artistId: "a1", albumArt: "", popularity: 22 },
  { id: "2", name: "Sunrise", artist: "Sol", artistId: "a2", albumArt: "", popularity: 47 },
  { id: "3", name: "Neon", artist: "Lumen", artistId: "a3", albumArt: "", popularity: 68 },
  { id: "4", name: "Stadium", artist: "Atlas", artistId: "a4", albumArt: "", popularity: 91 },
];

describe("generateQuizQuestions", () => {
  it("limits questions to available tracks and creates answerable options", () => {
    const questions = generateQuizQuestions(tracks, 10);
    expect(questions).toHaveLength(tracks.length);
    questions.forEach((question) => {
      expect(question.options).toContain(question.correctAnswer);
      expect(question.track).toMatchObject({ id: expect.any(String), name: expect.any(String) });
    });
  });

  it("uses the correct popularity bands", () => {
    const questions = generateQuizQuestions(tracks, 4);
    const popularityQuestions = questions.filter((question) => question.type === "popularity");
    popularityQuestions.forEach((question) => {
      const score = question.track.popularity;
      expect(question.correctAnswer).toBe(score < 35 ? "Underground · 0–34" : score < 60 ? "Rising · 35–59" : score < 80 ? "Popular · 60–79" : "Massive · 80–100");
    });
  });

  it("creates the same daily challenge for the same date", () => {
    expect(generateDailyQuizQuestions(tracks, "2026-09-10")).toEqual(generateDailyQuizQuestions(tracks, "2026-09-10"));
  });

  it("does not collide on dates whose digits merely add up to the same value", () => {
    const first = generateDailyQuizQuestions(tracks, "2026-09-12");
    const second = generateDailyQuizQuestions(tracks, "2026-09-21");
    expect(first).not.toEqual(second);
  });

  it("still produces answerable questions when one artist dominates the library", () => {
    const oneArtist = tracks.map((track) => ({ ...track, artist: "Nova" }));
    generateDailyQuizQuestions(oneArtist, "2026-09-10").forEach((question) => expect(question.options).toContain(question.correctAnswer));
  });
});
