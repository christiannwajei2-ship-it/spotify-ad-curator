import type { ReportTemplate, ReportData } from './types';

export const TEMPLATE_CONFIGS: Record<ReportTemplate, { label: string; description: string; icon: string }> = {
  'executive-summary': {
    label: 'Executive Summary',
    description: 'High-level KPIs, platform comparison, and recommendations',
    icon: '📋',
  },
  'detailed-performance': {
    label: 'Detailed Performance',
    description: 'Day-by-day breakdown with all metrics',
    icon: '📊',
  },
  'platform-comparison': {
    label: 'Platform Comparison',
    description: 'Side-by-side platform analysis',
    icon: '🏆',
  },
  'roi-report': {
    label: 'ROI Report',
    description: 'Return on investment breakdown with projections',
    icon: '💰',
  },
};

export function buildReportTitle(template: ReportTemplate): string {
  return TEMPLATE_CONFIGS[template]?.label ?? 'Analytics Report';
}

export function applyTemplate(template: ReportTemplate, data: ReportData): ReportData {
  switch (template) {
    case 'executive-summary':
      return { ...data, title: 'Executive Summary Report', dailyData: undefined };
    case 'detailed-performance':
      return { ...data, title: 'Detailed Performance Report' };
    case 'platform-comparison':
      return { ...data, title: 'Platform Comparison Report', dailyData: undefined };
    case 'roi-report':
      return { ...data, title: 'ROI Report' };
    default:
      return data;
  }
}
