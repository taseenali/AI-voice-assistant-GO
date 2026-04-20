/**
 * Service Mapping Module
 * Maps to: 03_service_mapping.md
 *
 * Maps detected user problems → Genuine Optimum services.
 * Always translates user language into business solutions.
 *
 * Rule: NEVER say "We offer X." Instead, connect solution to user's stated problem.
 */

import { INTENTS } from './intent-detector.js';

export class ServiceMapper {

  constructor() {
    // ─── Service Definitions ──────────────────────────────
    this._services = {
      [INTENTS.WEBSITE]: {
        name:        'Website Development',
        tagline:     'Custom-built websites that convert visitors into clients',
        description: 'We build modern, high-performance websites tailored to your business — whether it\'s a brand showcase, lead generation site, or full e-commerce platform.',
        outcomes: [
          'A professional online presence that builds trust instantly',
          'A site optimized to turn visitors into paying clients',
          'Full control over your brand\'s digital identity'
        ],
        problemFrames: {
          'no_website':      'Without a website, potential clients can\'t find or trust your business online. A strong web presence changes that completely.',
          'bad_website':     'An outdated or slow website can actually drive clients away. A modern, fast site builds immediate credibility.',
          'need_ecommerce':  'Selling online opens your business to customers 24/7. A well-built store can significantly increase your revenue.',
          'default':         'Having the right website can be a real game-changer for your business. It becomes your best salesperson — working around the clock.'
        }
      },

      [INTENTS.SEO]: {
        name:        'SEO & Search Visibility',
        tagline:     'Get found by the right people, consistently',
        description: 'We help your business show up where your potential clients are already searching — on Google and other search engines.',
        outcomes: [
          'Consistent organic leads without paying for every click',
          'Higher visibility means more trust and more inquiries',
          'Long-term traffic growth that compounds over time'
        ],
        problemFrames: {
          'no_leads':       'It sounds like visibility might be the issue. When people can\'t find you online, you\'re invisible to potential clients. We help fix that.',
          'no_traffic':     'Getting consistent traffic is the foundation of online growth. Search optimization builds a steady stream of people who are already looking for what you offer.',
          'competitors':    'If your competitors show up before you on Google, they\'re getting the clients that should be yours. We can change that.',
          'default':        'Visibility is everything. When your business shows up at the right time, in front of the right people, growth becomes much more predictable.'
        }
      },

      [INTENTS.AI_AUTOMATION]: {
        name:        'AI & Automation Systems',
        tagline:     'Work smarter by automating what slows you down',
        description: 'We build intelligent systems — chatbots, voice assistants, workflow automation — that handle the repetitive work so your team can focus on growth.',
        outcomes: [
          'Hours of manual work eliminated every week',
          'Faster response times that impress your clients',
          'Scalability without needing to hire more people'
        ],
        problemFrames: {
          'manual_work':    'If your team is spending hours on repetitive tasks, that\'s time and money being wasted. Automation can handle that and free up your team for higher-value work.',
          'scalability':    'When your processes depend on people doing everything manually, scaling becomes a nightmare. Smart automation lets you grow without the growing pains.',
          'customer_support': 'Imagine having a system that handles common client questions 24/7, instantly. That\'s what AI-powered assistants can do for your business.',
          'default':        'The smartest businesses are the ones that automate what they can and focus their people on what matters. We can help you do exactly that.'
        }
      },

      [INTENTS.APP_DEV]: {
        name:        'Application Development',
        tagline:     'Turn your idea into a working product',
        description: 'We design and build custom applications — mobile apps, web platforms, and software tools — from concept to launch.',
        outcomes: [
          'A custom-built solution that fits your exact needs',
          'A product that works seamlessly across devices',
          'Full ownership of your technology'
        ],
        problemFrames: {
          'has_idea':       'Sounds like you have a clear vision. Turning that into a real, working product is exactly what we do. Let\'s talk about making it happen.',
          'needs_tool':     'Off-the-shelf tools can only take you so far. A custom solution built around your workflow can save time and increase efficiency dramatically.',
          'mobile':         'A mobile app puts your business directly in your clients\' hands. The right app can transform how they interact with you.',
          'default':        'Every great product starts with a clear problem to solve. We help turn ideas into polished, functional software that people actually want to use.'
        }
      }
    };
  }

  // ─── Public API ───────────────────────────────────────────

  /**
   * Get service info for a detected intent
   * @param {string} intent - The detected intent key
   * @returns {object|null} Service definition or null
   */
  getService(intent) {
    return this._services[intent] || null;
  }

  /**
   * Position a service in terms of the user's problem (outcome-based, not feature-based)
   * @param {string} intent - Service intent
   * @param {string} [problemKey] - Specific problem context key
   * @returns {string} A problem-framed positioning statement
   */
  positionSolution(intent, problemKey) {
    const service = this._services[intent];
    if (!service) return "I'd love to learn more about what you need so I can point you in the right direction.";

    const frame = service.problemFrames[problemKey] || service.problemFrames['default'];
    return frame;
  }

  /**
   * Get a random outcome statement for a service
   */
  getOutcome(intent) {
    const service = this._services[intent];
    if (!service) return null;
    return service.outcomes[Math.floor(Math.random() * service.outcomes.length)];
  }

  /**
   * Get all available services for general inquiry
   * @returns {string} Formatted service overview
   */
  getServiceOverview() {
    return "We help businesses grow in four key areas: building powerful websites, increasing visibility through search optimization, creating AI and automation systems that save time, and developing custom apps and software. Which of those sounds most relevant to what you're working on?";
  }

  /**
   * Get service name by intent
   */
  getServiceName(intent) {
    const service = this._services[intent];
    return service ? service.name : null;
  }
}
