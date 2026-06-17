export interface ServerHealth {
  status: 'UP' | 'DOWN';
  timestamp: string;
  version?: string;
}

export interface LLMHealth {
  available: boolean;
  endpoint: string;
  model?: string;
}

export interface WebhookQueueStatus {
  pending: number;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
}

export interface CalendarStatus {
  enabled: boolean;
  connected: boolean;
}