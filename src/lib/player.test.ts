import { beforeEach, describe, expect, it } from "vitest";
import { achievementsFor, currentStreak, readPlayerProgress, saveRound } from "./player";

describe("player progress", () => {
  beforeEach(() => localStorage.clear());
  it("stores a daily round and counts a current streak", () => {
    const today = new Date().toISOString().slice(0, 10);
    saveRound("player", { id: "daily", date: today, mode: "daily", score: 5, total: 5, completedAt: new Date().toISOString() });
    const progress = readPlayerProgress("player");
    expect(progress.rounds).toHaveLength(1);
    expect(currentStreak(progress.dailyDates)).toBe(1);
    expect(achievementsFor(progress, 5).find((item) => item.name === "Taste-maker")?.unlocked).toBe(true);
  });
  it("does not count duplicate daily plays twice and stops at a missing day", () => {
    const now = new Date(); const today = now.toISOString().slice(0, 10); now.setUTCDate(now.getUTCDate() - 2);
    const twoDaysAgo = now.toISOString().slice(0, 10);
    saveRound("player", { id: "first", date: today, mode: "daily", score: 1, total: 5, completedAt: "now" });
    saveRound("player", { id: "second", date: today, mode: "daily", score: 2, total: 5, completedAt: "now" });
    const progress = readPlayerProgress("player");
    expect(progress.dailyDates).toEqual([today]);
    expect(currentStreak([today, twoDaysAgo])).toBe(1);
  });
  it("recovers from a valid-but-wrong progress shape", () => {
    localStorage.setItem("spotiquiz:player:player", JSON.stringify({ rounds: "bad", dailyDates: {} }));
    expect(readPlayerProgress("player")).toEqual({ rounds: [], dailyDates: [] });
  });
});
