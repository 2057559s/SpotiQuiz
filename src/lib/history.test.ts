import { beforeEach, describe, expect, it } from "vitest";
import { readAnswerHistory, saveAnswerHistory } from "./history";

const answer = { id: "a1", question: "Who?", track: "Midnight", artist: "Nova", albumArt: "", answer: "Nova", correctAnswer: "Nova", isCorrect: true, createdAt: "2026-01-01T00:00:00.000Z" };

describe("answer history", () => {
  beforeEach(() => localStorage.clear());
  it("keeps history separate per signed-in player", () => {
    saveAnswerHistory("one@example.com", [answer]);
    expect(readAnswerHistory("one@example.com")).toEqual([answer]);
    expect(readAnswerHistory("two@example.com")).toEqual([]);
  });
  it("keeps newest answers first and caps the stored history", () => {
    saveAnswerHistory("player", Array.from({ length: 205 }, (_, index) => ({ ...answer, id: String(index) })));
    const saved = readAnswerHistory("player");
    expect(saved).toHaveLength(200);
    expect(saved[0].id).toBe("0");
  });
  it("recovers from a valid-but-wrong localStorage shape", () => {
    localStorage.setItem("spotiquiz:answers:player", JSON.stringify({ answer }));
    expect(readAnswerHistory("player")).toEqual([]);
    expect(() => saveAnswerHistory("player", [answer])).not.toThrow();
  });
});
