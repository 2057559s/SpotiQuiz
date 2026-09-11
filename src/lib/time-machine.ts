export interface StreamingEvent { ts?: string; endTime?: string; ms_played?: number; msPlayed?: number; master_metadata_track_name?: string; trackName?: string; master_metadata_album_artist_name?: string; artistName?: string; }
export interface EraTrack { name: string; artist: string; plays: number; minutes: number; }
export interface TimeMachineData { importedAt: string; totalPlays: number; totalMinutes: number; firstListen?: string; lastListen?: string; yearly: Record<string, EraTrack[]>; seasons: Record<string, EraTrack[]>; }

const eventDate = (event: StreamingEvent) => event.ts || event.endTime;
const trackName = (event: StreamingEvent) => event.master_metadata_track_name || event.trackName;
const artistName = (event: StreamingEvent) => event.master_metadata_album_artist_name || event.artistName || "Unknown artist";
const seasonFor = (date: Date) => { const month = date.getUTCMonth(); return month < 2 || month === 11 ? "Winter" : month < 5 ? "Spring" : month < 8 ? "Summer" : "Autumn"; };

const rankTracks = (events: StreamingEvent[]) => {
  const tracks = new Map<string, EraTrack>();
  events.forEach((event) => { const name = trackName(event); if (!name) return; const artist = artistName(event); const id = `${name}—${artist}`; const item = tracks.get(id) || { name, artist, plays: 0, minutes: 0 }; item.plays += 1; item.minutes += Math.round(((event.ms_played || event.msPlayed || 0) / 60000) * 10) / 10; tracks.set(id, item); });
  return [...tracks.values()].sort((a, b) => b.plays - a.plays || b.minutes - a.minutes).slice(0, 5);
};

export const buildTimeMachine = (events: StreamingEvent[]): TimeMachineData => {
  const valid = events.filter((event) => eventDate(event) && trackName(event) && (event.ms_played || event.msPlayed || 0) >= 30000);
  const dated = valid.map((event) => ({ event, date: new Date(eventDate(event)!) })).filter(({ date }) => !Number.isNaN(date.getTime()));
  const yearly: Record<string, StreamingEvent[]> = {}; const seasons: Record<string, StreamingEvent[]> = {};
  dated.forEach(({ event, date }) => { const year = String(date.getUTCFullYear()); const season = `${seasonFor(date)} ${year}`; (yearly[year] ||= []).push(event); (seasons[season] ||= []).push(event); });
  return { importedAt: new Date().toISOString(), totalPlays: dated.length, totalMinutes: Math.round(dated.reduce((sum, { event }) => sum + (event.ms_played || event.msPlayed || 0), 0) / 60000), firstListen: dated.sort((a, b) => a.date.getTime() - b.date.getTime())[0]?.date.toISOString(), lastListen: dated.sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.date.toISOString(), yearly: Object.fromEntries(Object.entries(yearly).map(([year, items]) => [year, rankTracks(items)])), seasons: Object.fromEntries(Object.entries(seasons).map(([season, items]) => [season, rankTracks(items)])) };
};

const key = (userKey: string) => `spotiquiz:time-machine:${userKey}`;
export const readTimeMachine = (userKey: string): TimeMachineData | null => { if (typeof window === "undefined") return null; try { return JSON.parse(localStorage.getItem(key(userKey)) || "null"); } catch { return null; } };
export const saveTimeMachine = (userKey: string, data: TimeMachineData) => { if (typeof window !== "undefined") localStorage.setItem(key(userKey), JSON.stringify(data)); };
