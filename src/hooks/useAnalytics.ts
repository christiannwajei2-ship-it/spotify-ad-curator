// ===================================================
// useAnalytics — Custom hook for analytics data
// ===================================================

import { useState, useCallback, useMemo } from 'react';
import {
  DEMO_PLATFORM_METRICS,
  DEMO_TIME_SERIES,
  DEMO_ANALYTICS_SUMMARY,
  DEMO_PLATFORM_SERIES,
} from '../services/analytics/demo-data';
import { comparePlatforms, buildROIReport, aggregateByPeriod } from '../services/analytics/calculator';
import {
  exportToJSON,
  exportToCSV,
  downloadSummaryText,
} from '../services/analytics/export';
import type {
  AnalyticsSummary,
  PlatformMetrics,
  TimeSeriesData,
  ROIReport,
  TimePeriod,
} from '../services/analytics/types';

export const useAnalytics = () => {
  const [period, setPeriod] = useState<TimePeriod>('30d');
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // ── Data accessors ──────────────────────────────

  const getSummary = useCallback((): AnalyticsSummary => {
    return DEMO_ANALYTICS_SUMMARY;
  }, []);

  const getPlatformMetrics = useCallback((): PlatformMetrics[] => {
    return DEMO_PLATFORM_METRICS;
  }, []);

  const getPlatformComparison = useCallback((): PlatformMetrics[] => {
    return comparePlatforms(DEMO_PLATFORM_METRICS);
  }, []);

  const getTimeSeries = useCallback(
    (platform: string = 'all'): TimeSeriesData => {
      const series =
        platform === 'all'
          ? DEMO_TIME_SERIES
          : (DEMO_PLATFORM_SERIES[platform] ?? DEMO_TIME_SERIES);

      return {
        ...series,
        points: aggregateByPeriod(series.points, period),
      };
    },
    [period]
  );

  const getROIReport = useCallback(
    (spend: number, followers: number, streams: number): ROIReport => {
      return buildROIReport(spend, followers, streams, 30);
    },
    []
  );

  // ── Export helpers ──────────────────────────────

  const exportJSON = useCallback(() => {
    exportToJSON({
      summary:   DEMO_ANALYTICS_SUMMARY,
      platforms: DEMO_PLATFORM_METRICS,
      roi:       buildROIReport(
        DEMO_ANALYTICS_SUMMARY.totalSpend,
        DEMO_PLATFORM_METRICS.reduce((s, p) => s + p.newFollowers, 0),
        DEMO_PLATFORM_METRICS.reduce((s, p) => s + p.newStreams, 0)
      ),
    });
  }, []);

  const exportCSV = useCallback(() => {
    exportToCSV(DEMO_PLATFORM_METRICS);
  }, []);

  const exportText = useCallback(() => {
    downloadSummaryText(DEMO_ANALYTICS_SUMMARY, DEMO_PLATFORM_METRICS);
  }, []);

  // ── Memoised totals ─────────────────────────────

  const totals = useMemo(() => {
    const platforms = DEMO_PLATFORM_METRICS;
    return {
      spend:       platforms.reduce((s, p) => s + p.spend,       0),
      followers:   platforms.reduce((s, p) => s + p.newFollowers, 0),
      streams:     platforms.reduce((s, p) => s + p.newStreams,   0),
      impressions: platforms.reduce((s, p) => s + p.impressions,  0),
      clicks:      platforms.reduce((s, p) => s + p.clicks,       0),
    };
  }, []);

  return {
    // State
    period,
    setPeriod,
    isLoading,
    error,
    isDemo: true,

    // Data
    getSummary,
    getPlatformMetrics,
    getPlatformComparison,
    getTimeSeries,
    getROIReport,
    totals,

    // Exports
    exportJSON,
    exportCSV,
    exportText,
  };
};
