import type { Config } from '../../../types/config';
import { Badge } from '../../shared/Badge';

interface VisualViewProps {
  config: Config;
}

export function VisualView({ config }: VisualViewProps) {
  return (
    <div className="space-y-6">
      {/* Company & Assistant Info */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Company & Assistant
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-text-muted mb-1">Company Name</p>
            <p className="text-sm font-medium text-text-primary">{config.company_name}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Assistant Name</p>
            <p className="text-sm font-medium text-text-primary">{config.assistant_name}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Role</p>
            <p className="text-sm font-medium text-text-primary">{config.assistant_role}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Tone</p>
            <p className="text-sm font-medium text-text-primary">{config.tone}</p>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Goals
        </h3>
        <div className="mb-4">
          <p className="text-xs text-text-muted mb-1">Primary Goal</p>
          <p className="text-sm font-medium text-text-primary">{config.primary_goal}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-2">Secondary Goals</p>
          <div className="flex flex-wrap gap-2">
            {config.secondary_goals.map((goal) => (
              <Badge key={goal} label={goal} variant="neutral" />
            ))}
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          AI Configuration
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-text-muted mb-1">AI Tier</p>
            <p className="text-sm font-medium text-text-primary">Tier {config.ai_tier}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">LLM Model</p>
            <p className="text-sm font-medium text-text-primary">{config.llm_model}</p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Services ({config.services.length})
        </h3>
        <div className="space-y-3">
          {config.services.map((service) => (
            <div
              key={service.intent_key}
              className="border border-card-border rounded-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-text-primary">
                  {service.display_name}
                </span>
                <Badge label={service.intent_key} variant="default" />
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Discovery Questions:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {service.discovery_questions.map((q, i) => (
                    <li key={i} className="text-xs text-text-secondary">{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qualification Fields */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Qualification Fields
        </h3>
        <div className="flex flex-wrap gap-2">
          {config.qualification_fields.map((field) => (
            <Badge key={field} label={field} variant="neutral" />
          ))}
        </div>
      </div>

      {/* Emergency Keywords */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Emergency Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {config.emergency_keywords.map((kw) => (
            <Badge key={kw} label={kw} variant="danger" />
          ))}
        </div>
      </div>

      {/* Greetings */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Greetings ({config.greetings.length})
        </h3>
        <div className="space-y-2">
          {config.greetings.map((greeting, i) => (
            <p key={i} className="text-sm text-text-secondary italic border-l-2 border-primary pl-3">
              "{greeting}"
            </p>
          ))}
        </div>
      </div>

      {/* CTA Templates */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Call-to-Action Templates ({config.cta_templates.length})
        </h3>
        <div className="space-y-2">
          {config.cta_templates.map((cta, i) => (
            <p key={i} className="text-sm text-text-secondary border-l-2 border-success pl-3">
              "{cta}"
            </p>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-6">
        <h3 className="text-section-heading font-semibold text-text-primary mb-4">
          Calendar Integration
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-text-muted mb-1">Enabled</p>
            <p className={`text-sm font-medium ${config.calendar_enabled ? 'text-success' : 'text-neutral'}`}>
              {config.calendar_enabled ? 'Yes' : 'No'}
            </p>
          </div>
          {config.calendar_id && (
            <div>
              <p className="text-xs text-text-muted mb-1">Calendar ID</p>
              <p className="text-sm font-mono text-text-secondary">{config.calendar_id}</p>
            </div>
          )}
          {config.calendar_url && (
            <div>
              <p className="text-xs text-text-muted mb-1">Calendar URL</p>
              <p className="text-sm font-mono text-text-secondary break-all">{config.calendar_url}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}