import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuestionCard from "./QuestionCard";

const question = { id: "q1", type: "artist" as const, prompt: "Which artist made Midnight?", correctAnswer: "Nova", options: ["Nova", "Sol", "Atlas", "Lumen"], track: { id: "track", name: "Midnight", artist: "Nova", artistId: "artist", albumArt: "", popularity: 30 } };

describe("QuestionCard", () => {
  it("keeps submission disabled until an answer is chosen and submits the selected answer", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={question} questionNumber={1} totalQuestions={10} onAnswer={onAnswer} />);
    const submit = screen.getByRole("button", { name: "Lock in answer" });
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Nova/ }));
    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    expect(onAnswer).toHaveBeenCalledWith("Nova", "maybe", false);
  });

  it("hides the artist and reveals a cover clue only when asked", () => {
    const cover = { ...question, id: "cover", type: "cover" as const, clue: "The artist begins with N." };
    render(<QuestionCard question={cover} questionNumber={1} totalQuestions={1} onAnswer={vi.fn()} />);
    expect(screen.getByText("Artist hidden")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Reveal a clue/ }));
    expect(screen.getByText("The artist begins with N.")).toBeInTheDocument();
  });

  it("clears a prior selection when the next question is displayed", () => {
    const { rerender } = render(<QuestionCard question={question} questionNumber={1} totalQuestions={2} onAnswer={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Nova/ }));
    expect(screen.getByRole("button", { name: "Lock in answer" })).toBeEnabled();
    rerender(<QuestionCard question={{ ...question, id: "q2", prompt: "Who made Sunrise?" }} questionNumber={2} totalQuestions={2} onAnswer={vi.fn()} />);
    expect(screen.getByRole("button", { name: "See my result" })).toBeDisabled();
  });
});
