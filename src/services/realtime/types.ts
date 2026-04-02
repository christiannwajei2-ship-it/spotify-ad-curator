export type EventType = 'impression' | 'click' | 'conversion' | 'spend' | 'engagement';
export type StreamStatus = 'connected' | 'disconnected' | 'reconnecting';

export interface RealTimeEvent {
  id: string;
  type: EventType;
  platform: 'meta' | 'tiktok' | 'youtube' | 'google';
  timestamp: number;
  value: number;
  campaignId?: string;
}

export interface LiveMetric {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
}

export interface WebSocketConfig {
  url?: string;
  demoMode: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export interface ChartDataPoint {
  time: string;
  impressions: number;
  clicks: number;
  conversions: number;
}
