import type { RealTimeEvent, EventType, WebSocketConfig, StreamStatus, LiveMetric } from './types';
import { generateEvent } from './event-generator';

type EventCallback = (event: RealTimeEvent) => void;

export class WebSocketClient {
  private status: StreamStatus = 'disconnected';
  private listeners: Map<EventType | 'all', EventCallback[]> = new Map();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempts = 0;
  private maxAttempts: number;
  private reconnectDelay: number;
  private ws: WebSocket | null = null;
  private config: WebSocketConfig | null = null;

  private metrics: LiveMetric = { impressions: 0, clicks: 0, conversions: 0, spend: 0, ctr: 0, cpc: 0 };

  constructor() {
    this.maxAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(config: WebSocketConfig): void {
    this.config = config;
    this.maxAttempts = config.maxReconnectAttempts ?? 5;
    this.reconnectDelay = config.reconnectDelay ?? 1000;

    if (config.demoMode) {
      this.startDemoMode();
    } else if (config.url) {
      this.connectWebSocket(config.url);
    }
  }

  private startDemoMode(): void {
    this.status = 'connected';
    const delay = Math.random() * 3000 + 2000; // 2-5 seconds
    this.intervalId = setInterval(() => {
      const event = generateEvent();
      this.updateMetrics(event);
      this.emit(event);
    }, delay);
  }

  private connectWebSocket(url: string): void {
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        this.status = 'connected';
        this.reconnectAttempts = 0;
      };
      this.ws.onmessage = (e) => {
        try {
          const event: RealTimeEvent = JSON.parse(e.data);
          this.updateMetrics(event);
          this.emit(event);
        } catch {}
      };
      this.ws.onclose = () => {
        this.status = 'disconnected';
        this.scheduleReconnect();
      };
      this.ws.onerror = () => {
        this.status = 'disconnected';
      };
    } catch {
      this.status = 'disconnected';
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxAttempts) return;
    this.reconnectAttempts++;
    this.status = 'reconnecting';
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    setTimeout(() => {
      if (this.config?.url) this.connectWebSocket(this.config.url);
    }, delay);
  }

  private updateMetrics(event: RealTimeEvent): void {
    if (event.type === 'impression') this.metrics.impressions += event.value;
    if (event.type === 'click') {
      this.metrics.clicks += event.value;
      this.metrics.ctr = this.metrics.impressions > 0
        ? (this.metrics.clicks / this.metrics.impressions) * 100
        : 0;
      this.metrics.cpc = this.metrics.spend > 0 && this.metrics.clicks > 0
        ? this.metrics.spend / this.metrics.clicks
        : 0;
    }
    if (event.type === 'conversion') this.metrics.conversions += event.value;
    if (event.type === 'spend') {
      this.metrics.spend += event.value;
      this.metrics.cpc = this.metrics.clicks > 0
        ? this.metrics.spend / this.metrics.clicks
        : 0;
    }
  }

  private emit(event: RealTimeEvent): void {
    const allCallbacks = this.listeners.get('all') ?? [];
    const typeCallbacks = this.listeners.get(event.type) ?? [];
    [...allCallbacks, ...typeCallbacks].forEach((cb) => cb(event));
  }

  subscribe(eventType: EventType | 'all', callback: EventCallback): void {
    const existing = this.listeners.get(eventType) ?? [];
    this.listeners.set(eventType, [...existing, callback]);
  }

  unsubscribe(eventType: EventType | 'all'): void {
    this.listeners.delete(eventType);
  }

  disconnect(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.status = 'disconnected';
  }

  getStatus(): StreamStatus {
    return this.status;
  }

  getMetrics(): LiveMetric {
    return { ...this.metrics };
  }
}

export const wsClient = new WebSocketClient();
