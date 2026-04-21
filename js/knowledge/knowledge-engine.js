export class KnowledgeEngine {
  constructor() {
    this.insights = {
      GROWTH_OUTCOME: {
        variants: [
          { text: "doubling sales usually comes down to traffic and conversion", tone: "analytical", depth: 2 },
          { text: "in most cases, growth is about getting the right visitors and then converting them", tone: "guided", depth: 2 },
          { text: "scaling revenue typically depends on your traffic quality and conversion rates", tone: "professional", depth: 2 },
          { text: "if we optimize both traffic and conversion, growth becomes a predictable formula", tone: "expert", depth: 4 },
          { text: "the most scalable businesses treat their lead pipeline like a system, not a hope", tone: "analytical", depth: 3 },
          { text: "consistent growth happens when you control both inbound traffic and what happens after they land", tone: "guided", depth: 3 }
        ],
        intent: 'WEBSITE',
        triggerTokens: ['sale', 'client', 'customer', 'revenue', 'growth', 'double', 'scale', 'profit']
      },
      AD_EFFICIENCY: {
        variants: [
          { text: "if ads aren't performing, the issue is often targeting or your landing page", tone: "analytical", depth: 2 },
          { text: "ad problems usually indicate a bottleneck in your funnel or search visibility", tone: "guided", depth: 2 },
          { text: "inefficient ad spend typically means you need better organic reach or a stronger funnel", tone: "professional", depth: 3 },
          { text: "moving from paid dependency to organic search visibility builds long-term value", tone: "expert", depth: 4 },
          { text: "most businesses overspend on ads because their organic foundation isn't strong enough", tone: "analytical", depth: 3 },
          { text: "the best performing businesses use ads to amplify organic growth, not replace it", tone: "guided", depth: 3 }
        ],
        intent: 'SEO',
        triggerTokens: ['ad', 'google ads', 'facebook ads', 'expensive', 'not working', 'ad spend', 'ads']
      },
      OPERATIONAL_SCALABILITY: {
        variants: [
          { text: "manual processes usually limit your ability to scale operations efficiently", tone: "analytical", depth: 2 },
          { text: "repetitive tasks are often a sign that your business needs better automation", tone: "guided", depth: 2 },
          { text: "freeing up your time usually requires moving from manual work to digital systems", tone: "professional", depth: 3 },
          { text: "intelligent automation doesn't just save time — it eliminates the primary bottleneck to scaling", tone: "expert", depth: 4 },
          { text: "most business owners spend 60% of their day on tasks a system could handle", tone: "analytical", depth: 2 },
          { text: "the businesses that scale fastest are the ones that automate their intake and follow-up first", tone: "guided", depth: 3 }
        ],
        intent: 'AI_AUTOMATION',
        triggerTokens: ['manual', 'repetitive', 'too much work', 'busy', 'time', 'process', 'automate']
      },
      BRAND_TRUST: {
        variants: [
          { text: "a professional digital presence is the first step in building brand credibility", tone: "professional", depth: 2 },
          { text: "trust is won or lost in the first few seconds a visitor lands on your site", tone: "guided", depth: 3 },
          { text: "your website is your digital handshake — it sets the tone for every client relationship", tone: "analytical", depth: 2 },
          { text: "businesses that invest in their online presence typically see higher conversion rates", tone: "expert", depth: 3 }
        ],
        intent: 'WEBSITE',
        triggerTokens: ['trust', 'professional', 'look', 'legit', 'brand', 'credibility', 'image']
      },
      LEAD_GENERATION: {
        variants: [
          { text: "the biggest gap in most businesses is not having a consistent way to generate leads", tone: "analytical", depth: 2 },
          { text: "without a lead generation system, you're always depending on word of mouth", tone: "guided", depth: 2 },
          { text: "building a predictable lead flow is usually the single highest-impact investment", tone: "professional", depth: 3 },
          { text: "the most successful businesses we work with have automated their lead generation", tone: "expert", depth: 4 }
        ],
        intent: 'SEO',
        triggerTokens: ['leads', 'lead', 'inquiries', 'prospects', 'generate', 'pipeline']
      },
      COMPETITIVE_POSITIONING: {
        variants: [
          { text: "if competitors are showing up online and you're not, they're getting the clients you should have", tone: "analytical", depth: 2 },
          { text: "in today's market, your online position directly impacts how many calls you get", tone: "guided", depth: 2 },
          { text: "competitive advantage online comes from a combination of visibility, speed, and credibility", tone: "professional", depth: 3 },
          { text: "the businesses winning right now are the ones that invested in their digital strategy early", tone: "expert", depth: 4 }
        ],
        intent: 'SEO',
        triggerTokens: ['competitor', 'competition', 'behind', 'losing', 'market', 'edge']
      },
      CLIENT_RETENTION: {
        variants: [
          { text: "retaining clients is usually 5x cheaper than acquiring new ones", tone: "analytical", depth: 2 },
          { text: "a lot of businesses focus on new clients but forget about keeping the ones they have", tone: "guided", depth: 2 },
          { text: "smart automation can keep your existing clients engaged without extra effort from your team", tone: "professional", depth: 3 },
          { text: "the most profitable businesses have systems that nurture relationships automatically", tone: "expert", depth: 4 }
        ],
        intent: 'AI_AUTOMATION',
        triggerTokens: ['retain', 'keep', 'existing', 'churn', 'follow up', 'followup', 'nurture']
      },
      DIGITAL_TRANSFORMATION: {
        variants: [
          { text: "going digital isn't just about having a website — it's about having a system that works for your business", tone: "analytical", depth: 2 },
          { text: "a lot of businesses know they need to go digital but aren't sure where to start", tone: "guided", depth: 2 },
          { text: "digital transformation is really about connecting your sales, marketing, and operations into one flow", tone: "professional", depth: 3 },
          { text: "the businesses that thrive long-term are the ones that build their digital infrastructure early", tone: "expert", depth: 4 }
        ],
        intent: 'WEBSITE',
        triggerTokens: ['digital', 'online', 'modernize', 'upgrade', 'transform', 'technology']
      }
    };

    // Outcome Framing Repository (4 categories)
    this.outcomes = {
      GROWTH: [
        { text: "scaling becomes a system rather than a struggle", focus: "predictability" },
        { text: "you start seeing consistent lead flow every single month", focus: "consistency" },
        { text: "your business finally has the foundation to handle more clients", focus: "volume" },
        { text: "revenue growth stops being unpredictable and starts being something you control", focus: "control" }
      ],
      EFFICIENCY: [
        { text: "you get your time back to focus on high-level growth", focus: "time" },
        { text: "your operations can run smoothly without constant manual oversight", focus: "automation" },
        { text: "your team can focus on what actually moves the needle instead of repetitive tasks", focus: "focus" }
      ],
      VISIBILITY: [
        { text: "potential clients start finding you instead of you chasing them", focus: "inbound" },
        { text: "your business shows up where your ideal clients are already looking", focus: "positioning" },
        { text: "you build a reputation online that compounds over time", focus: "long-term" }
      ],
      CONVERSION: [
        { text: "more of your website visitors actually become paying clients", focus: "rate" },
        { text: "your online presence starts working like a 24/7 salesperson", focus: "always-on" },
        { text: "the gap between interest and action gets smaller for your prospects", focus: "friction" }
      ]
    };

    this.fallbackInsight = "That usually depends on what's currently limiting your growth right now";
    this._variantCounters = {};
    this._outcomeCounters = {};
  }

  analyze(nlpData, contextMemory, rawInput, currentDepth = 1) {
    const text = (rawInput || "").toLowerCase();
    let bestMatch = null;

    for (const [key, data] of Object.entries(this.insights)) {
      const matchFound = data.triggerTokens.some(token => text.includes(token)) || 
                         (key === 'GROWTH_OUTCOME' && nlpData.growth_outcome);
      if (matchFound) {
        bestMatch = { key, ...data };
        break;
      }
    }

    if (!bestMatch) {
      return {
        insight: this.fallbackInsight,
        outcome: this._getOutcome('GROWTH'),
        recommendedIntent: null,
        confidence: 0
      };
    }

    // Depth-aligned variant selection + round-robin
    const variants = bestMatch.variants.filter(v => v.depth <= currentDepth + 1);
    const pool = variants.length > 0 ? variants : bestMatch.variants;
    
    if (!this._variantCounters[bestMatch.key]) this._variantCounters[bestMatch.key] = 0;
    const idx = this._variantCounters[bestMatch.key] % pool.length;
    this._variantCounters[bestMatch.key]++;
    const variant = pool[idx];

    // Category-mapped outcome selection
    const outcomeCategory = bestMatch.key.includes('SCALABILITY') || bestMatch.key.includes('RETENTION')
      ? 'EFFICIENCY'
      : bestMatch.key.includes('AD_') || bestMatch.key.includes('COMPETITIVE') || bestMatch.key.includes('LEAD_')
      ? 'VISIBILITY'
      : bestMatch.key.includes('BRAND') || bestMatch.key.includes('DIGITAL')
      ? 'CONVERSION'
      : 'GROWTH';

    return {
      insight: variant.text,
      outcome: this._getOutcome(outcomeCategory),
      metadata: { tone: variant.tone, depth: variant.depth },
      recommendedIntent: bestMatch.intent,
      confidence: 0.85
    };
  }

  _getOutcome(category) {
    const pool = this.outcomes[category] || this.outcomes.GROWTH;
    if (!this._outcomeCounters[category]) this._outcomeCounters[category] = 0;
    const idx = this._outcomeCounters[category] % pool.length;
    this._outcomeCounters[category]++;
    return pool[idx].text;
  }
}
