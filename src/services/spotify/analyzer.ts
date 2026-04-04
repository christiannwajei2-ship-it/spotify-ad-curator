import type {
  SpotifyPlaylist,
  SpotifyArtist,
  SpotifyAudioFeatures,
  PlaylistAnalysis,
  GenreCount,
  ArtistSummary,
  MoodProfile,
} from '../../types';

const getMoodLabel = (avg: SpotifyAudioFeatures): { label: string; description: string } => {
  const { energy, valence, danceability, acousticness, instrumentalness } = avg;

  if (energy > 0.7 && valence > 0.6) return { label: 'Energetic & Happy 🔥😊', description: 'High-energy, feel-good vibes that get you moving' };
  if (energy > 0.7 && valence < 0.4) return { label: 'Intense & Dark 🖤🔥', description: 'Powerful, raw emotional intensity' };
  if (danceability > 0.7 && energy > 0.5) return { label: 'Groovy & Danceable 🕺', description: 'Made for the dance floor — irresistible rhythms' };
  if (valence > 0.65) return { label: 'Happy & Uplifting 😊✨', description: 'Positive, mood-boosting energy' };
  if (acousticness > 0.6 && energy < 0.5) return { label: 'Acoustic & Mellow 🎸', description: 'Raw, intimate, stripped-back sound' };
  if (instrumentalness > 0.5) return { label: 'Instrumental & Focus 🎶', description: 'Perfect for focus and deep work' };
  if (energy < 0.4 && valence > 0.4) return { label: 'Chill & Relaxed 😌', description: 'Easy-going, laid-back vibes' };
  if (valence < 0.35) return { label: 'Melancholy & Emotional 😔', description: 'Deep, introspective emotional journey' };

  return { label: 'Balanced & Versatile 🎵', description: 'A well-rounded mix that appeals to many moods' };
};

const avgFeatures = (features: SpotifyAudioFeatures[]): SpotifyAudioFeatures => {
  const sum = features.reduce(
    (acc, f) => ({
      ...acc,
      danceability: acc.danceability + f.danceability,
      energy: acc.energy + f.energy,
      valence: acc.valence + f.valence,
      acousticness: acc.acousticness + f.acousticness,
      instrumentalness: acc.instrumentalness + f.instrumentalness,
      speechiness: acc.speechiness + f.speechiness,
      liveness: acc.liveness + f.liveness,
      tempo: acc.tempo + f.tempo,
    }),
    {
      id: 'avg', key: 0, loudness: 0, mode: 0, time_signature: 4, duration_ms: 0,
      danceability: 0, energy: 0, valence: 0, acousticness: 0,
      instrumentalness: 0, speechiness: 0, liveness: 0, tempo: 0,
    } as SpotifyAudioFeatures
  );
  const n = features.length;
  return {
    ...sum,
    danceability: sum.danceability / n,
    energy: sum.energy / n,
    valence: sum.valence / n,
    acousticness: sum.acousticness / n,
    instrumentalness: sum.instrumentalness / n,
    speechiness: sum.speechiness / n,
    liveness: sum.liveness / n,
    tempo: sum.tempo / n,
  };
};

export const analyzePlaylist = (
  playlist: SpotifyPlaylist,
  artists: SpotifyArtist[],
  audioFeatures: SpotifyAudioFeatures[]
): PlaylistAnalysis => {
  const tracks = playlist.tracks.items
    .map((i) => i.track)
    .filter(Boolean);

  // ---- Genre Analysis ----
  const genreMap = new Map<string, number>();
  artists.forEach((artist) => {
    artist.genres.forEach((g) => genreMap.set(g, (genreMap.get(g) ?? 0) + 1));
  });

  const totalGenreMentions = Array.from(genreMap.values()).reduce((a, b) => a + b, 0);
  const genres: GenreCount[] = Array.from(genreMap.entries())
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: totalGenreMentions > 0 ? count / totalGenreMentions : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const topGenre = genres[0]?.genre ?? 'Pop';

  // ---- Popularity Stats ----
  const popularities = tracks.map((t) => t.popularity).filter((p) => p > 0);
  const avgPop = popularities.length
    ? popularities.reduce((a, b) => a + b, 0) / popularities.length
    : 50;
  const minPop = Math.min(...popularities);
  const maxPop = Math.max(...popularities);

  const distribution = [
    { range: '0-20', count: popularities.filter((p) => p <= 20).length },
    { range: '21-40', count: popularities.filter((p) => p > 20 && p <= 40).length },
    { range: '41-60', count: popularities.filter((p) => p > 40 && p <= 60).length },
    { range: '61-80', count: popularities.filter((p) => p > 60 && p <= 80).length },
    { range: '81-100', count: popularities.filter((p) => p > 80).length },
  ];

  // ---- Mood Profile ----
  const avg = audioFeatures.length > 0 ? avgFeatures(audioFeatures) : {
    id: 'avg', key: 0, loudness: -10, mode: 1, time_signature: 4, duration_ms: 0,
    danceability: 0.55, energy: 0.6, valence: 0.5, acousticness: 0.25,
    instrumentalness: 0.05, speechiness: 0.1, liveness: 0.15, tempo: 120,
  } as SpotifyAudioFeatures;

  const moodMeta = getMoodLabel(avg);
  const moodProfile: MoodProfile = {
    energy: avg.energy,
    danceability: avg.danceability,
    valence: avg.valence,
    acousticness: avg.acousticness,
    instrumentalness: avg.instrumentalness,
    tempo: avg.tempo,
    label: moodMeta.label,
    description: moodMeta.description,
  };

  // ---- Top Artists ----
  const artistTrackCount = new Map<string, number>();
  tracks.forEach((t) => {
    t.artists.forEach((a) => {
      artistTrackCount.set(a.id, (artistTrackCount.get(a.id) ?? 0) + 1);
    });
  });

  const topArtists: ArtistSummary[] = Array.from(artistTrackCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => {
      const artist = artists.find((a) => a.id === id);
      const fallbackTrack = tracks.find((t) => t.artists.some((a) => a.id === id));
      const fallbackArtist = fallbackTrack?.artists.find((a) => a.id === id);
      return {
        id,
        name: artist?.name ?? fallbackArtist?.name ?? 'Unknown',
        trackCount: count,
        popularity: artist?.popularity ?? 50,
        imageUrl: artist?.images[0]?.url,
      };
    });

  // ---- Genre Diversity ----
  const uniqueGenres = genres.length;
  const genreDiversityScore = Math.min(uniqueGenres / 10, 1);

  const totalDurationMs = tracks.reduce((sum, t) => sum + (t.duration_ms ?? 0), 0);

  return {
    playlist: {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images[0]?.url,
      followerCount: playlist.followers?.total ?? 0,
      trackCount: tracks.length,
      totalDurationMs,
      spotifyUrl: playlist.external_urls.spotify,
    },
    genres,
    topGenre,
    popularityStats: { average: Math.round(avgPop), min: minPop, max: maxPop, distribution },
    moodProfile,
    topArtists,
    genreDiversityScore,
    analyzedAt: new Date().toISOString(),
  };
};
