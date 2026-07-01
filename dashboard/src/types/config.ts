export interface Config {
  company_name: string;
  assistant_name: string;
  assistant_role: string;
  tone: string;
  primary_goal: string;
  secondary_goals: string[];
  ai_tier: number;
  llm_model: string;
  llm_provider?: string;
  transfer_number?: string;
  oncall_webhook_url?: string;
  clinic_phone?: string;
  services: Service[];
  qualification_fields: string[];
  emergency_keywords: string[];
  greetings: string[];
  cta_templates: string[];
  calendar_enabled: boolean;
  calendar_id?: string;
  calendar_url?: string;
}

export interface Service {
  intent_key: string;
  display_name: string;
  discovery_questions: string[];
}