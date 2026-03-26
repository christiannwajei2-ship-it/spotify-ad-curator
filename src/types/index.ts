// ===================================================
// Spotify Types
// ===================================================

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  external_urls: { spotify: string };
  preview_url: string | null;
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string; width: number; height: number }[];
  followers: { total: number };
  tracks: {
    total: number;
    items: { track: SpotifyTrack; added_at: string }[];
  };
  owner: { id: string; display_name: string };
  external_urls: { spotify: string };
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  images: { url: string }[];
  followers: { total: number };
  external_urls: { spotify: string };
}

export type SpotifyUrlType = 'playlist' | 'artist' | 'user' | 'album' | 'track';

export interface ParsedSpotifyUrl {
  type: SpotifyUrlType;
  id: string;
  raw: string;
}

// ===================================================
// Analysis Types
// ===================================================

export interface GenreCount {
  genre: string;
  count: number;
  percentage: number;
}

export interface ArtistSummary {
  id: string;
  name: string;
  trackCount: number;
  popularity: number;
  imageUrl?: string;
}

export interface MoodProfile {
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  tempo: number;
  label: string;
  description: string;
}

export interface PlaylistAnalysis {
  playlist: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    followerCount: number;
    trackCount: number;
    totalDurationMs: number;
    spotifyUrl: string;
  };
  genres: GenreCount[];
  topGenre: string;
  popularityStats: {
    average: number;
    min: number;
    max: number;
    distribution: { range: string; count: number }[];
  };
  moodProfile: MoodProfile;
  topArtists: ArtistSummary[];
  genreDiversityScore: number;
  analyzedAt: string;
}

// ===================================================
// Targeting Types
// ===================================================

export interface CountryTarget {
  code: string;
  name: string;
  flag: string;
  estimatedCpm: number;
  estimatedCpc: number;
  audienceSize: string;
  primaryReason: string;
  score: number;
}

export interface DemographicTarget {
  ageMin: number;
  ageMax: number;
  genderTargeting: 'all' | 'male' | 'female';
  primaryAgeRange: string;
  reasoning: string;
}

export interface InterestTarget {
  id: string;
  name: string;
  category: string;
  audienceSize?: string;
}

export interface BudgetRecommendation {
  dailyBudget: number;
  currency: string;
  estimatedReach: { min: number; max: number };
  estimatedImpressions: { min: number; max: number };
  estimatedLinkClicks: { min: number; max: number };
  topCountries: CountryTarget[];
  notes: string[];
}

export interface TargetingRecommendation {
  countries: CountryTarget[];
  demographics: DemographicTarget;
  interests: InterestTarget[];
  budgetRecommendation: BudgetRecommendation;
  primaryGenre: string;
  confidence: number;
  generatedAt: string;
}

// ===================================================
// Meta Ads Types
// ===================================================

export interface AdCreativeTemplate {
  id: string;
  name: string;
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
  imageSpecs: {
    recommended: string;
    aspectRatio: string;
    minWidth: number;
    minHeight: number;
  };
  placements: string[];
}

export interface AdSet {
  name: string;
  dailyBudget: number;
  bidStrategy: string;
  objective: string;
  startTime: string;
  targeting: {
    geoLocations: { countries: string[] };
    ageMin: number;
    ageMax: number;
    genders?: number[];
    interests: { id: string; name: string }[];
    publisherPlatforms: string[];
    facebookPositions: string[];
    instagramPositions: string[];
  };
  optimizationGoal: string;
  billingEvent: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  objective: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  dailyBudget: number;
  specialAdCategories: string[];
  adSets: AdSet[];
  creatives: AdCreativeTemplate[];
  generatedAt: string;
  playlistName: string;
  genre: string;
  metaApiPayload?: Record<string, unknown>;
}

// ===================================================
// App State Types
// ===================================================

export type AppStep = 'landing' | 'analyzing' | 'dashboard' | 'targeting' | 'ad-generator' | 'history';

export interface AppState {
  currentStep: AppStep;
  spotifyUrl: string;
  analysis: PlaylistAnalysis | null;
  targeting: TargetingRecommendation | null;
  campaigns: AdCampaign[];
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
}

export interface SavedCampaign extends AdCampaign {
  savedAt: string;
  notes?: string;
  performanceMetrics?: {
    impressions: number;
    clicks: number;
    spend: number;
    followers: number;
  };
}
