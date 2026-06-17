export interface APIResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
  version?: string;
}

export interface LLMHealth {
  available: boolean;
  endpoint: string;
  model?: string;
}