import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResultsCard from "./ResultsCard";

describe("ResultsCard", () => {
  beforeEach(() => {
    Object.assign(navigator, { share: undefined, clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it("labels the result and routes each action to its callback", () => {
    const onRetry = vi.fn(); const onBack = vi.fn();
    render(<ResultsCard score={4} total={5} mode="daily" onRetry={onRetry} onBack={onBack} />);
    expect(screen.getByText("Taste-maker")).toBeInTheDocument();
    expect(screen.getByText("80% point accuracy. Your answers are already saved.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play another round" }));
    fireEvent.click(screen.getByRole("button", { name: "Back to music" }));
    expect(onRetry).toHaveBeenCalledOnce();
    expect(onBack).toHaveBeenCalledOnce();
  });

  it("copies a shareable score when native sharing is unavailable", async () => {
    render(<ResultsCard score={2} total={4} mode="free" onRetry={vi.fn()} onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Share result" }));
    await vi.waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("2/4 points (50%)")));
  });
});
