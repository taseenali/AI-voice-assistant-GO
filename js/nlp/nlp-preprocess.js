export function preprocess(input) {
  const cleanedText = input
    .toLowerCase()
    .replace(/\b(umm|uhh|uh|um|like|you know|honestly|basically|actually)\b/g, '')
    .replace(/[^\w\s.,?!—-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleanedText.split(/[\s.,?!—-]+/).filter(t => t.length > 0);
  
  return { tokens, cleanedText };
}
