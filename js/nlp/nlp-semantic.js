const SEMANTIC_MAP = {
  clinic: ["practice", "hospital", "office", "doctor", "specialist"],
  checkup: ["appointment", "exam", "visit", "consultation", "screening"],
  care_outcome: ["recovery", "better", "improvement", "healthier", "treatment", "cure", "relief"],
  automation: ["scheduling", "booking", "assistant", "reminder"],
  history_established: ["years", "long time", "decades", "since", "chronic"],
  history_new: ["just started", "recent", "new issue", "sudden", "started yesterday"]
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
