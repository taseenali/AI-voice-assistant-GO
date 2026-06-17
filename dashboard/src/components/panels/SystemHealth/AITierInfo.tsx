import { Brain, Zap, Shield } from 'lucide-react';

const tierInfo = [
  {
    tier: 1,
    label: 'Tier 1 — Pattern Matching',
    description: 'Regex + keyword matching. No LLM required.',
    icon: Zap,
    features: ['Fast response', 'Deterministic output', 'Works offline'],
  },
  {
    tier: 2,
    label: 'Tier 2 — Local LLM (Ollama)',
    description: 'On-premises LLM via Ollama for natural language understanding.',
    icon: Brain,
    features: ['Context-aware responses', 'Fallback handling', 'Runs on local hardware'],
  },
  {
    tier: 3,
    label: 'Tier 3 — Cloud API',
    description: 'External API fallback (OpenAI-compatible endpoint).',
    icon: Shield,
    features: ['Maximum capability', 'Requires API key', 'Internet-dependent'],
  },
];

export function AITierInfo() {
  return (
    <div className="card p-6 mb-8">
      <h3 className="text-section-heading font-semibold text-text-primary mb-4">
        AI Tier Architecture
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        MedVoice uses a 3-tier AI architecture that falls back gracefully when higher tiers are unavailable.
        The current configuration is using <strong>Tier 2 (Ollama)</strong> with Tier 1 fallback.
      </p>
      <div className="grid grid-cols-3 gap-4">
        {tierInfo.map((tier) => (
          <div
            key={tier.tier}
            className="border border-card-border rounded-card p-4 hover:shadow-card transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <tier.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">
                {tier.label}
              </span>
            </div>
            <p className="text-xs text-text-secondary mb-3">
              {tier.description}
            </p>
            <ul className="space-y-1">
              {tier.features.map((feat) => (
                <li key={feat} className="text-xs text-text-muted flex items-center gap-1">
                  <span className="w-1 h-1 bg-success rounded-full" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}