import type { PlaylistAnalysis, TargetingRecommendation, BudgetRecommendation, CountryTarget } from '../../types';
import { GENRE_COUNTRY_MAP, GENRE_KEYWORD_MAP } from './countries';
import { GENRE_DEMOGRAPHICS, GENRE_INTERESTS } from './demographics';

const normalizeGenre = (genre: string): string => {
  const lower = genre.toLowerCase();
  for (const [keyword, mapped] of Object.entries(GENRE_KEYWORD_MAP)) {
    if (lower.includes(keyword)) return mapped;
  }
  return 'default';
};

const findBestGenreKey = (genres: { genre: string; percentage: number }[]): string => {
  for (const { genre } of genres) {
    const key = normalizeGenre(genre);
    if (key !== 'default') return key;
  }
  return 'default';
};

const calculateBudgetRecommendation = (
  dailyBudget: number,
  topCountries: CountryTarget[]
): BudgetRecommendation => {
  const avgCpm = topCountries.reduce((sum, c) => sum + c.estimatedCpm, 0) / topCountries.length;
  const avgCpc = topCountries.reduce((sum, c) => sum + c.estimatedCpc, 0) / topCountries.length;

  const dailyImpressions = Math.round((dailyBudget / avgCpm) * 1000);
  const dailyClicks = Math.round(dailyBudget / avgCpc);

  // Estimated reach is typically 20-40% of impressions for first exposure
  const reachMin = Math.round(dailyImpressions * 0.2);
  const reachMax = Math.round(dailyImpressions * 0.4);

  const notes: string[] = [
    '💡 Start with $1–3/day using Advantage+ placements for lowest CPM',
    '🎯 Use Lowest Cost bidding to maximize reach within budget',
    `📍 ${topCountries.length >= 2 ? `${topCountries[0].name} + ${topCountries[1].name}` : topCountries[0]?.name ?? 'Top market'} will give you best ROI`,
    '⏱ Run ads for at least 7 days before evaluating performance',
    '🔄 A/B test at least 2 ad creatives simultaneously',
  ];

  return {
    dailyBudget,
    currency: 'USD',
    estimatedReach: { min: reachMin, max: reachMax },
    estimatedImpressions: { min: Math.round(dailyImpressions * 0.8), max: Math.round(dailyImpressions * 1.2) },
    estimatedLinkClicks: { min: Math.round(dailyClicks * 0.7), max: Math.round(dailyClicks * 1.3) },
    topCountries: topCountries.slice(0, 3),
    notes,
  };
};

export const generateTargeting = (analysis: PlaylistAnalysis, dailyBudget = 2): TargetingRecommendation => {
  const genreKey = findBestGenreKey(analysis.genres);

  const countries = GENRE_COUNTRY_MAP[genreKey] ?? GENRE_COUNTRY_MAP.default;
  const demographics = GENRE_DEMOGRAPHICS[genreKey] ?? GENRE_DEMOGRAPHICS.default;
  const interests = GENRE_INTERESTS[genreKey] ?? GENRE_INTERESTS.default;

  // Sort countries by score and prioritize low-CPM ones for ultra-low budget
  const sortedCountries = [...countries].sort((a, b) => {
    // Weighted score: 70% match score, 30% inverse CPM (lower is better for small budget)
    const aScore = a.score * 0.7 + (1 - Math.min(a.estimatedCpm / 10, 1)) * 30;
    const bScore = b.score * 0.7 + (1 - Math.min(b.estimatedCpm / 10, 1)) * 30;
    return bScore - aScore;
  });

  const budgetRecommendation = calculateBudgetRecommendation(dailyBudget, sortedCountries.slice(0, 3));

  return {
    countries: sortedCountries,
    demographics,
    interests,
    budgetRecommendation,
    primaryGenre: analysis.topGenre,
    confidence: analysis.genres.length > 0 ? Math.min(0.5 + analysis.genres[0].percentage, 0.95) : 0.5,
    generatedAt: new Date().toISOString(),
  };
};
