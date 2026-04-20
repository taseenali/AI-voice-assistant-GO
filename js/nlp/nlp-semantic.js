const SEMANTIC_MAP = {
  website: ["site", "webpage", "landing page", "web", "online presence"],
  seo: ["ranking", "google traffic", "search results", "organic traffic", "visibility", "found on google", "search engine"],
  growth_outcome: ["leads", "sales", "revenue", "customers", "clients", "inquiries", "prospects", "bookings", "jobs", "growth", "scale", "double", "triple"],
  automation: ["workflow", "manual work", "repetitive tasks", "save time", "efficiency", "chatbots", "assistant"],
  tenure_established: ["years", "long time", "decades", "since", "founded"],
  tenure_startup: ["just started", "launching", "new business", "startup", "trying to start"]
};

export function normalizeSemantics(text) {
  let normalizedText = text;
  
  for (const [canonical, synonyms] of Object.entries(SEMANTIC_MAP)) {
    for (const syn of synonyms) {
      const regex = new RegExp(`\\b${syn}\\b`, 'gi');
      if (regex.test(normalizedText)) {
        normalizedText = normalizedText.replace(regex, canonical);
      }
    }
  }
  
  return normalizedText;
}
