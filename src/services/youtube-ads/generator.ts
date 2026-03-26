import type { PlaylistAnalysis, TargetingRecommendation } from '../../types';
import type {
  YouTubeCampaign,
  YouTubeAdGroup,
  YouTubeAdGroupTargeting,
  YouTubeTopicTargeting,
  YouTubeAudienceSegment,
  YouTubeAdFormat,
} from './types';
import { generateYouTubeCreatives } from './templates';
import { generateId } from '../../utils/helpers';
import { capitalize } from '../../utils/formatters';

const YOUTUBE_MIN_DAILY_BUDGET = 1; // USD
const YOUTUBE_MUSIC_CHANNEL_URL = 'https://www.youtube.com/channel/UCsvqVGtbbyHaMoevxljACtg';

// ===================================================
// Genre → topic IDs (Google Ads music topic taxonomy)
// ===================================================

const GENRE_TOPIC_MAP: Record<string, { topicIds: string[]; topicLabels: string[] }> = {
  default:     { topicIds: ['/m/04rlf'],      topicLabels: ['Music'] },
  afrobeats:   { topicIds: ['/m/04rlf', '/m/0g293'], topicLabels: ['Music', 'African Music'] },
  'hip-hop':   { topicIds: ['/m/04rlf', '/m/0glt670'], topicLabels: ['Music', 'Hip Hop'] },
  rap:         { topicIds: ['/m/04rlf', '/m/0glt670'], topicLabels: ['Music', 'Hip Hop'] },
  'r&b':       { topicIds: ['/m/04rlf', '/m/06by7'], topicLabels: ['Music', 'R&B'] },
  soul:        { topicIds: ['/m/04rlf', '/m/06by7'], topicLabels: ['Music', 'Soul'] },
  pop:         { topicIds: ['/m/04rlf', '/m/064t9'], topicLabels: ['Music', 'Pop'] },
  rock:        { topicIds: ['/m/04rlf', '/m/06j6l'], topicLabels: ['Music', 'Rock'] },
  edm:         { topicIds: ['/m/04rlf', '/m/0b54l3'], topicLabels: ['Music', 'Electronic'] },
  dance:       { topicIds: ['/m/04rlf', '/m/0b54l3'], topicLabels: ['Music', 'Dance Music'] },
  house:       { topicIds: ['/m/04rlf', '/m/0b54l3'], topicLabels: ['Music', 'House Music'] },
  jazz:        { topicIds: ['/m/04rlf', '/m/03_d0'],  topicLabels: ['Music', 'Jazz'] },
  classical:   { topicIds: ['/m/04rlf', '/m/0ggq0m'], topicLabels: ['Music', 'Classical'] },
  country:     { topicIds: ['/m/04rlf', '/m/01lyv'],  topicLabels: ['Music', 'Country'] },
  latin:       { topicIds: ['/m/04rlf', '/m/06bxc'],  topicLabels: ['Music', 'Latin Music'] },
  reggaeton:   { topicIds: ['/m/04rlf', '/m/0glt670'], topicLabels: ['Music', 'Reggaeton'] },
  kpop:        { topicIds: ['/m/04rlf', '/m/0glt670'], topicLabels: ['Music', 'K-Pop'] },
  indie:       { topicIds: ['/m/04rlf', '/m/06j6l'],  topicLabels: ['Music', 'Indie'] },
};

const getTopicTargeting = (genre: string): YouTubeTopicTargeting => {
  const key = genre.toLowerCase().replace(/[^a-z0-9&-]/g, '');
  return GENRE_TOPIC_MAP[key] ?? GENRE_TOPIC_MAP['default'];
};

// ===================================================
// Genre → YouTube Music audience segments
// ===================================================

const getAudienceSegments = (genre: string): YouTubeAudienceSegment[] => {
  const segments: YouTubeAudienceSegment[] = [
    { id: 'yt-music-lovers', name: 'Music lovers' },
    { id: 'yt-streaming-users', name: 'Music streaming app users' },
  ];

  const lower = genre.toLowerCase();
  if (lower.includes('afro')) {
    segments.push({ id: 'yt-african-music', name: 'African music fans' });
  } else if (lower.includes('hip') || lower.includes('rap')) {
    segments.push({ id: 'yt-hiphop-fans', name: 'Hip-hop & rap fans' });
  } else if (lower.includes('edm') || lower.includes('dance')) {
    segments.push({ id: 'yt-edm-fans', name: 'EDM & dance music fans' });
  } else if (lower.includes('rock')) {
    segments.push({ id: 'yt-rock-fans', name: 'Rock music fans' });
  } else if (lower.includes('pop')) {
    segments.push({ id: 'yt-pop-fans', name: 'Pop music fans' });
  } else if (lower.includes('latin') || lower.includes('reggaeton')) {
    segments.push({ id: 'yt-latin-fans', name: 'Latin music fans' });
  } else if (lower.includes('kpop') || lower.includes('k-pop')) {
    segments.push({ id: 'yt-kpop-fans', name: 'K-pop fans' });
  }

  return segments;
};

// ===================================================
// Age group mapping
// ===================================================

const buildAgeGroups = (ageMin: number, ageMax: number): string[] => {
  const groups: string[] = [];
  const ranges: [number, number, string][] = [
    [18, 24, 'AGE_RANGE_18_24'],
    [25, 34, 'AGE_RANGE_25_34'],
    [35, 44, 'AGE_RANGE_35_44'],
    [45, 54, 'AGE_RANGE_45_54'],
    [55, 64, 'AGE_RANGE_55_64'],
    [65, 999, 'AGE_RANGE_65_UP'],
  ];
  for (const [lo, hi, label] of ranges) {
    if (lo <= ageMax && hi >= ageMin) groups.push(label);
  }
  return groups.length > 0 ? groups : ['AGE_RANGE_18_24', 'AGE_RANGE_25_34'];
};

// ===================================================
// API payload builder
// ===================================================

const buildYouTubeApiPayload = (
  campaign: Omit<YouTubeCampaign, 'id' | 'youtubeApiPayload'>,
  adGroups: YouTubeAdGroup[]
): Record<string, unknown> => ({
  campaign: {
    name: campaign.name,
    advertisingChannelType: 'VIDEO',
    status: 'PAUSED',
    campaignBudget: {
      amountMicros: campaign.dailyBudget * 1_000_000,
      deliveryMethod: 'STANDARD',
    },
  },
  adGroups: adGroups.map((ag) => ({
    name: ag.name,
    adGroupType:
      ag.adFormat === 'INFEED_VIDEO'
        ? 'VIDEO_TRUE_VIEW_IN_DISPLAY'
        : 'VIDEO_TRUE_VIEW_IN_STREAM',
    cpcBidMicros: ag.targetCpvMicros ?? 50000,
    targeting: {
      geoTargets: ag.targeting.locations,
      ageRanges: ag.targeting.ageGroups,
      genders: ag.targeting.genders,
      topics: ag.targeting.topics.topicIds,
      audiences: ag.targeting.audiences.map((a) => a.id),
      placements: ag.targeting.placementChannels,
    },
    ads: ag.ads.map((ad) => ({
      name: ad.name,
      headline: ad.creative.headline,
      longHeadline: ad.creative.longHeadline,
      description: ad.creative.description,
      callToAction: ad.creative.callToAction,
      format: ad.creative.format,
    })),
  })),
});

// ===================================================
// Main generator
// ===================================================

const AD_FORMATS: YouTubeAdFormat[] = ['INSTREAM_SKIPPABLE', 'INFEED_VIDEO', 'SHORTS'];

export const generateYouTubeCampaign = (
  analysis: PlaylistAnalysis,
  targeting: TargetingRecommendation,
  dailyBudget = 5
): YouTubeCampaign => {
  const creatives = generateYouTubeCreatives(analysis);
  const { countries, demographics, interests } = targeting;

  const budget = Math.max(dailyBudget, YOUTUBE_MIN_DAILY_BUDGET);
  const topCountries = countries.slice(0, 5).map((c) => c.code);
  const genreLabel = capitalize(analysis.topGenre);
  const today = new Date().toISOString().split('T')[0];

  const topicTargeting = getTopicTargeting(analysis.topGenre);
  const audienceSegments = getAudienceSegments(analysis.topGenre);
  const ageGroups = buildAgeGroups(demographics.ageMin, demographics.ageMax);

  const sharedTargeting: YouTubeAdGroupTargeting = {
    locations: topCountries,
    ageGroups,
    genders: ['GENDER_MALE', 'GENDER_FEMALE', 'GENDER_UNDETERMINED'],
    topics: topicTargeting,
    audiences: audienceSegments,
    placementChannels: [YOUTUBE_MUSIC_CHANNEL_URL],
    keywords: [
      `${analysis.topGenre} playlist`,
      `${analysis.topGenre} music`,
      `best ${analysis.topGenre} songs`,
      ...interests.slice(0, 3).map((i) => i.name.toLowerCase()),
    ],
  };

  // One ad group per format
  const adGroups: YouTubeAdGroup[] = AD_FORMATS.map((format) => {
    const formatCreatives = creatives.filter((c) => c.format === format);
    return {
      name: `${genreLabel} — ${format.replace(/_/g, ' ')} — ${today}`,
      adFormat: format,
      dailyBudget: budget,
      biddingStrategy: 'TARGET_CPV',
      targetCpvMicros: 50000, // $0.05 CPV
      startDate: today,
      targeting: sharedTargeting,
      ads: formatCreatives.map((creative) => ({
        name: `${creative.name} — ${analysis.playlist.name}`,
        status: 'DRAFT' as const,
        creative,
      })),
    };
  });

  const campaignBase = {
    name: `🎵 ${analysis.playlist.name} — ${genreLabel} YouTube Campaign`,
    campaignType: 'VIDEO_VIEWS' as const,
    status: 'DRAFT' as const,
    dailyBudget: budget,
    adGroups,
    generatedAt: new Date().toISOString(),
    playlistName: analysis.playlist.name,
    genre: analysis.topGenre,
  };

  return {
    ...campaignBase,
    id: generateId(),
    youtubeApiPayload: buildYouTubeApiPayload(campaignBase, adGroups),
  };
};
