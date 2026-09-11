export interface Track {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  albumArt: string;
  popularity: number;
  playedAt?: string;
}

export type QuizType = "artist" | "cover" | "rank" | "recency";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  track: Track;
  comparison?: Track;
  prompt: string;
  options: string[];
  correctAnswer: string;
  clue?: string;
}

export interface QuizTheme {
  name: string;
  detail: string;
}

const themes: QuizTheme[] = [
  { name: "Deep cuts", detail: "The tracks that reward a proper listen." },
  { name: "Main character energy", detail: "Your biggest musical moments, under pressure." },
  { name: "Memory lane", detail: "Can you recognise the soundtrack to your recent life?" },
  { name: "Taste test", detail: "No artist names. No easy wins." },
  { name: "After hours", detail: "A slightly more mysterious round from your library." },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const seedFrom = (value: string) =>
  [...value].reduce((seed, character) => ((seed * 31 + character.charCodeAt(0)) >>> 0), 7);

const seededShuffle = <T,>(items: T[], seedText: string) => {
  let seed = seedFrom(seedText);
  return [...items].sort(() => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 - 0.5;
  });
};

const distinct = <T,>(items: T[]) => [...new Set(items)];
const trackLabel = (track: Track) => `${track.name} — ${track.artist}`;
const artistChoices = (track: Track, tracks: Track[]) =>
  distinct([track.artist, ...tracks.map((item) => item.artist)]).slice(0, 4);

const optionsFor = (options: string[], key?: string) =>
  key ? seededShuffle(options, key) : shuffle(options);

const pickOther = (track: Track, tracks: Track[], key?: string) => {
  const choices = tracks.filter((item) => item.id !== track.id);
  return (key ? seededShuffle(choices, key) : shuffle(choices))[0];
};

const makeArtistQuestion = (track: Track, tracks: Track[], id: string, type: "artist" | "cover", key?: string): QuizQuestion => {
  const choices = artistChoices(track, tracks);
  return {
    id,
    type,
    track,
    prompt: type === "cover" ? "Who made this cover?" : `Who is behind “${track.name}”?`,
    options: optionsFor(choices, key),
    correctAnswer: track.artist,
    clue: `The artist begins with “${track.artist.charAt(0).toUpperCase()}”.`,
  };
};

const makeRankQuestion = (track: Track, tracks: Track[], id: string, key?: string): QuizQuestion => {
  const comparison = pickOther(track, tracks, key);
  if (!comparison) return makeArtistQuestion(track, tracks, id, "artist", key);
  const firstRank = tracks.findIndex((item) => item.id === track.id);
  const secondRank = tracks.findIndex((item) => item.id === comparison.id);
  const winner = firstRank <= secondRank ? track : comparison;
  const choices = [trackLabel(track), trackLabel(comparison)];
  return {
    id,
    type: "rank",
    track,
    comparison,
    prompt: "Which track ranks higher in your current favourites?",
    options: optionsFor(choices, key),
    correctAnswer: trackLabel(winner),
  };
};

const makeRecencyQuestion = (track: Track, recent: Track[], id: string, key?: string): QuizQuestion => {
  const comparison = pickOther(track, recent, key);
  if (!comparison) return makeArtistQuestion(track, recent, id, "artist", key);
  const trackTime = Date.parse(track.playedAt || "") || 0;
  const comparisonTime = Date.parse(comparison.playedAt || "") || 0;
  const winner = trackTime >= comparisonTime ? track : comparison;
  const choices = [trackLabel(track), trackLabel(comparison)];
  return {
    id,
    type: "recency",
    track,
    comparison,
    prompt: "Which track did you play more recently?",
    options: optionsFor(choices, key),
    correctAnswer: trackLabel(winner),
  };
};

const usableRecent = (recent: Track[]) => {
  const seen = new Set<string>();
  return recent.filter((track) => Boolean(track.playedAt) && !seen.has(track.id) && (seen.add(track.id) || true));
};

const buildQuestions = (tracks: Track[], recent: Track[], count: number, seed?: string) => {
  if (!tracks.length) return [];
  const questionTracks = (seed ? seededShuffle(tracks, `${seed}:tracks`) : shuffle(tracks)).slice(0, Math.min(count, tracks.length));
  const recents = usableRecent(recent);
  const types: QuizType[] = ["artist", "cover"];
  if (tracks.length > 1) types.push("rank");
  if (recents.length > 1) types.push("recency");

  return questionTracks.map((track, index) => {
    const type = types[index % types.length];
    const id = `${seed || "free"}-${index}-${track.id}`;
    const key = seed ? `${seed}:${index}` : undefined;
    if (type === "cover") return makeArtistQuestion(track, tracks, id, "cover", key);
    if (type === "rank") return makeRankQuestion(track, tracks, id, key);
    if (type === "recency") {
      const recentTrack = recents.find((item) => item.id === track.id) || recents[index % recents.length];
      return makeRecencyQuestion(recentTrack, recents, id, key);
    }
    return makeArtistQuestion(track, tracks, id, "artist", key);
  });
};

export const generateQuizQuestions = (tracks: Track[], count = 10, recent: Track[] = []) =>
  buildQuestions(tracks, recent, count);

export const generateDailyQuizQuestions = (tracks: Track[], date: string, count = 5, recent: Track[] = []) =>
  buildQuestions(tracks, recent, count, `daily:${date}`);

export const themeForDate = (date: string): QuizTheme => themes[seedFrom(date) % themes.length];
