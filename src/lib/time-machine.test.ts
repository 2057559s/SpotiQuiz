import { beforeEach, describe, expect, it } from "vitest";
import { buildTimeMachine, readTimeMachine, saveTimeMachine } from "./time-machine";

describe("time machine import", () => {
  beforeEach(() => localStorage.clear());

  it("filters short and malformed plays, then groups meaningful plays by year and season", () => {
    const data = buildTimeMachine([
      { ts: "2024-06-01T12:00:00Z", ms_played: 180_000, master_metadata_track_name: "Summer song", master_metadata_album_artist_name: "Nova" },
      { ts: "2024-06-04T12:00:00Z", ms_played: 120_000, master_metadata_track_name: "Summer song", master_metadata_album_artist_name: "Nova" },
      { ts: "2024-12-01T12:00:00Z", ms_played: 90_000, master_metadata_track_name: "Winter song", master_metadata_album_artist_name: "Sol" },
      { ts: "2024-06-05T12:00:00Z", ms_played: 29_999, master_metadata_track_name: "Skip", master_metadata_album_artist_name: "Nova" },
      { ts: "not-a-date", ms_played: 90_000, master_metadata_track_name: "Broken", master_metadata_album_artist_name: "Nova" },
      { ts: "2024-06-05T12:00:00Z", ms_played: 90_000 },
    ]);
    expect(data.totalPlays).toBe(3);
    expect(data.totalMinutes).toBe(7);
    expect(data.yearly["2024"][0]).toMatchObject({ name: "Summer song", artist: "Nova", plays: 2, minutes: 5 });
    expect(data.seasons["Summer 2024"][0].name).toBe("Summer song");
    expect(data.seasons["Winter 2024"][0].name).toBe("Winter song");
    expect(data.firstListen).toBe("2024-06-01T12:00:00.000Z");
    expect(data.lastListen).toBe("2024-12-01T12:00:00.000Z");
  });

  it("persists per player and treats corrupt stored data as unavailable", () => {
    const data = buildTimeMachine([]);
    saveTimeMachine("one", data);
    expect(readTimeMachine("one")).toEqual(data);
    expect(readTimeMachine("two")).toBeNull();
    localStorage.setItem("spotiquiz:time-machine:broken", "not-json");
    expect(readTimeMachine("broken")).toBeNull();
  });
});
