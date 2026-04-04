export type ExportFormat = 'pdf' | 'csv';

export interface DateRange {
  start: string;
  end: string;
  label: string;
}

export interface ExportConfig {
  format: ExportFormat;
  dateRange: DateRange;
  platforms: string[];
  template?: ReportTemplate;
  filename?: string;
}

export type ReportTemplate = 'executive-summary' | 'detailed-performance' | 'platform-comparison' | 'roi-report';

export interface ExportRecord {
  id: string;
  filename: string;
  format: ExportFormat;
  template?: ReportTemplate;
  createdAt: string;
  size: string;
}

export interface ReportData {
  title: string;
  dateRange: DateRange;
  summary: {
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCtr: number;
    roas: number;
  };
  platforms: {
    name: string;
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    roas: number;
  }[];
  dailyData?: {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  }[];
}
