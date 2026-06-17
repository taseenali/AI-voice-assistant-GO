export type SessionChannel = 'phone' | 'web';

export interface Session {
  sessionId: string;
  startTime: string;
  duration: number;
  turns: number;
  intent: string;
  leadCaptured: boolean;
  emergencyDetected: boolean;
  channel: SessionChannel;
  phoneNumber: string | null;
  recordingUrl: string | null;
}

export interface ConversationTurn {
  timestamp: string;
  role: 'user' | 'assistant';
  state: string;
  text: string;
}

export interface SessionStats {
  totalToday: number;
  leadsToday: number;
  avgDuration: number;
  emergenciesToday: number;
  phoneCallsToday: number;
  webCallsToday: number;
}
