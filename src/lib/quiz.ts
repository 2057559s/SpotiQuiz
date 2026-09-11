export interface Track {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  albumArt: string;
  popularity: number;
  playedAt?: string;
}

export interface QuizQuestion {
  id: string;
  type: "artist" | "popularity";
  track: Track;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

const shuffle = <T,>(values: T[]) => [...values].sort(() => Math.random() - 0.5);
const seededShuffle = <T,>(values: T[], seedText: string) => {
  // A positional hash prevents dates such as 2026-09-12 and 2026-09-21 from
  // producing the same daily challenge merely because their characters add up.
  let seed = [...seedText].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7);
  return [...values].sort(() => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; });
};
const popularityBand = (score: number) => score < 35 ? "Underground · 0–34" : score < 60 ? "Rising · 35–59" : score < 80 ? "Popular · 60–79" : "Massive · 80–100";

export const generateQuizQuestions = (tracks: Track[], count = 10): QuizQuestion[] => {
  const selected = shuffle(tracks).slice(0, Math.min(count, tracks.length));
  const artists = [...new Set(tracks.map((track) => track.artist))];
  return selected.map((track, index) => {
    if (index % 2 === 0) {
      const distractors = shuffle(artists.filter((artist) => artist !== track.artist)).slice(0, 3);
      return { id: `${track.id}-artist-${index}`, type: "artist", track, prompt: `Which artist made “${track.name}”?`, options: shuffle([track.artist, ...distractors]), correctAnswer: track.artist };
    }
    const correctAnswer = popularityBand(track.popularity);
    return { id: `${track.id}-popularity-${index}`, type: "popularity", track, prompt: `How big is “${track.name}” on Spotify right now?`, options: shuffle(["Underground · 0–34", "Rising · 35–59", "Popular · 60–79", "Massive · 80–100"]), correctAnswer };
  });
};

export const generateDailyQuizQuestions = (tracks: Track[], date: string, count = 5): QuizQuestion[] => {
  const selected = seededShuffle(tracks, date).slice(0, Math.min(count, tracks.length));
  const artists = [...new Set(tracks.map((track) => track.artist))];
  return selected.map((track, index) => {
    const deterministicOptions = (options: string[]) => seededShuffle(options, `${date}-${track.id}`);
    if (index % 2 === 0) {
      const distractors = seededShuffle(artists.filter((artist) => artist !== track.artist), `${date}-artists-${track.id}`).slice(0, 3);
      return { id: `daily-${date}-${track.id}`, type: "artist", track, prompt: `Which artist made “${track.name}”?`, options: deterministicOptions([track.artist, ...distractors]), correctAnswer: track.artist };
    }
    const correctAnswer = popularityBand(track.popularity);
    return { id: `daily-${date}-${track.id}`, type: "popularity", track, prompt: `How big is “${track.name}” on Spotify right now?`, options: deterministicOptions(["Underground · 0–34", "Rising · 35–59", "Popular · 60–79", "Massive · 80–100"]), correctAnswer };
  });
};
