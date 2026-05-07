/**
 * NLP Temporal Extractor
 * 
 * Extracts date/time patterns from user input for appointment booking.
 * Handles Pakistani Standard Time (+05:00) by default.
 */

export function extractDateTime(input) {
  if (!input || typeof input !== 'string') return { found: false };

  const text = input.toLowerCase();
  const result = {
    found: false,
    naturalLanguage: "",
    iso: null
  };

  // 1. Patterns
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const relativeDays = ["today", "tomorrow", "next week"];
  
  // Time regex: 3pm, 3:00pm, 15:00, etc.
  const timeRegex = /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m|p\.m)?\b/i;
  const periodRegex = /\b(morning|afternoon|evening|night)\b/i;

  // 2. Day Extraction
  let targetDate = new Date();
  let dayOffset = 0;
  let foundDay = false;

  // Check specific days
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (text.includes(daysOfWeek[i])) {
      const today = new Date().getDay();
      dayOffset = (i + 7 - today) % 7;
      if (dayOffset === 0 && text.includes("next")) dayOffset = 7;
      targetDate.setDate(targetDate.getDate() + dayOffset);
      result.naturalLanguage = daysOfWeek[i].charAt(0).toUpperCase() + daysOfWeek[i].slice(1);
      foundDay = true;
      break;
    }
  }

  // Check relative days
  if (!foundDay) {
    if (text.includes("tomorrow")) {
      targetDate.setDate(targetDate.getDate() + 1);
      result.naturalLanguage = "Tomorrow";
      foundDay = true;
    } else if (text.includes("today")) {
      result.naturalLanguage = "Today";
      foundDay = true;
    } else if (text.includes("next week")) {
      targetDate.setDate(targetDate.getDate() + 7);
      result.naturalLanguage = "Next week";
      foundDay = true;
    }
  }

  // 3. Time Extraction
  const timeMatch = text.match(timeRegex);
  const periodMatch = text.match(periodRegex);

  if (timeMatch) {
    result.found = true;
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const ampm = timeMatch[3];

    if (ampm) {
      if ((ampm.startsWith('p')) && hours < 12) hours += 12;
      if ((ampm.startsWith('a')) && hours === 12) hours = 0;
    } else if (hours < 9) { 
      // Heuristic: if no am/pm and < 9, assume pm (e.g. "3" -> 3pm)
      hours += 12;
    }

    targetDate.setHours(hours, minutes, 0, 0);
    const timeStr = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    result.naturalLanguage = result.naturalLanguage ? `${result.naturalLanguage} at ${timeStr}` : timeStr;
  } else if (periodMatch) {
    result.found = true;
    const period = periodMatch[1];
    let hours = 9; // morning
    if (period === 'afternoon') hours = 14;
    if (period === 'evening') hours = 18;
    if (period === 'night') hours = 20;

    targetDate.setHours(hours, 0, 0, 0);
    result.naturalLanguage = result.naturalLanguage ? `${result.naturalLanguage} ${period}` : period;
  }

  // 4. ISO Generation (PKT +05:00)
  if (result.found && foundDay) {
    // Format: YYYY-MM-DDTHH:mm:ss+05:00
    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
    const day = targetDate.getDate().toString().padStart(2, '0');
    const hour = targetDate.getHours().toString().padStart(2, '0');
    const min = targetDate.getMinutes().toString().padStart(2, '0');
    result.iso = `${year}-${month}-${day}T${hour}:${min}:00+05:00`;
  } else if (result.found) {
    // Only time found, no date
    result.iso = null; 
  }

  return result;
}
