import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import QuizComponent from "./QuizComponent";

vi.mock("@/lib/quiz", async () => {
  const actual = await vi.importActual<typeof import("@/lib/quiz")>("@/lib/quiz");
  const track = { id: "track-1", name: "Midnight", artist: "Nova", artistId: "nova", albumArt: "", popularity: 70 };
  const question = { id: "question-1", type: "artist" as const, track, prompt: "Who made Midnight?", options: ["Nova", "Sol"], correctAnswer: "Nova" };
  return { ...actual, generateDailyQuizQuestions: vi.fn(() => [question]), generateQuizQuestions: vi.fn(() => [question]) };
});

describe("QuizComponent", () => {
  beforeEach(() => localStorage.clear());

  it("takes an answer through to a saved completed daily round", () => {
    render(<QuizComponent userKey="player@example.com" tracks={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Play daily challenge" }));
    fireEvent.click(screen.getByRole("button", { name: /Nova$/ }));
    fireEvent.click(screen.getByRole("button", { name: "See my result" }));
    expect(screen.getByText("Deep listener")).toBeInTheDocument();
    const history = JSON.parse(localStorage.getItem("spotiquiz:answers:player@example.com") || "[]");
    const progress = JSON.parse(localStorage.getItem("spotiquiz:player:player@example.com") || "{}");
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ answer: "Nova", correctAnswer: "Nova", isCorrect: true });
    expect(progress.rounds[0]).toMatchObject({ mode: "daily", score: 2, total: 3 });
  });

  it("allows the player to return to the game selection after a result", () => {
    render(<QuizComponent userKey="player@example.com" tracks={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Start free play" }));
    fireEvent.click(screen.getByRole("button", { name: /Nova$/ }));
    fireEvent.click(screen.getByRole("button", { name: "See my result" }));
    fireEvent.click(screen.getByRole("button", { name: "Back to music" }));
    expect(screen.getByRole("button", { name: "Play daily challenge" })).toBeInTheDocument();
  });
});
