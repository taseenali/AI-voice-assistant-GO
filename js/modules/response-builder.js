/**
 * Response Builder — Deterministic Conversational Assembly Engine
 * 
 * Used ONLY for KB-enriched insight turns (not for flows, closes, objections).
 * Assembles: [Acknowledgment?] + [Context?] + [Insight] + [Outcome?] + [Question]
 * 
 * Features:
 *   - Context Priority: Reason for Visit > Patient Type > Insurance > DOB
 *   - Question Intelligence: Clarify, Diagnose, Confirm, Close
 *   - Anti-overconstruction Guard
 *   - Round-robin selection (zero consecutive repetition)
 */

export class ResponseBuilder {
  constructor(personality) {
    this.personality = personality;
    this.memory = {
      usedContext: [],
      recentOutcomes: [],
      ackCounter: 0
    };

    this.CONFIDENT_ACKS = [
      "Right,", "Makes sense —", "Got it —", "I see.", "Exactly.",
      "Understood.", "Okay,", "Sure —", "That's clear.", "Fair enough —",
      "Noted.", "That helps.", "Good point —", "Interesting.", "Alright,"
    ];

    // Expanded question banks (multiple per type, round-robin)
    this._questionBank = {
      CLARIFY: [
        "Just to be clear, is there a specific symptom or concern you'd like to address first?",
        "What's the one thing you'd most want to discuss with the doctor?",
        "If you could address one health concern tomorrow, what would it be?",
        "What would you say is the biggest health challenge for you right now?"
      ],
      DIAGNOSE: [
        "How is that currently affecting your daily activities?",
        "What does that look like day to day for your health?",
        "How long have you been noticing these symptoms?",
        "What have you tried so far to manage this?",
        "How would you describe your main goal for seeking care?"
      ],
      CONFIRM: [
        "Does it make sense to schedule an appointment to explore this further?",
        "Based on what you've shared, does this align with the care you're looking for?",
        "Would it be helpful if I walked you through how our clinic would approach your care?",
        "Does this sound like the right direction for your health?"
      ],
      CLOSE: [
        "I can set up a quick consultation to dive deeper — want me to do that?",
        "Would you like me to connect you with our team to map out next steps?",
        "Ready to take this to the next level? I can get things moving.",
        "Shall I set something up so we can put a plan together for you?"
      ]
    };
    this._questionCounters = {};
  }

  build(data) {
    const { 
      insight, outcome, leadData, depthLevel, 
      questionType, intentStrength, userType, forceShort = false
    } = data;

    const components = [];

    // 1. Acknowledgment (round-robin, conditional)
    if (!forceShort && intentStrength !== 'weak' && depthLevel >= 2) {
      components.push(this._selectAck());
    }

    // 2. Context Injection (max 1 snippet to keep it tight)
    const context = this._getInjectableContext(leadData);
    if (context && !forceShort) {
      components.push(context);
    }

    // 3. Insight (Mandatory)
    components.push(insight);

    // 4. Outcome Layer (only at depth 3+)
    if (depthLevel >= 3 && outcome && !forceShort) {
      const outcomeText = this._processOutcome(outcome);
      if (outcomeText) components.push(`If we address this, ${outcomeText}.`);
    }

    // 5. Question (Strategic, round-robin)
    const question = this._buildQuestion(questionType, leadData);
    components.push(question);

    // 6. Anti-overconstruction Guard (max 40 words)
    let final = this._assemble(components);
    if (final.split(' ').length > 40) {
      // Drop ack + outcome, keep insight + question
      const slim = [insight, question];
      return this._assemble(slim);
    }

    return final;
  }

  _selectAck() {
    const idx = this.memory.ackCounter % this.CONFIDENT_ACKS.length;
    this.memory.ackCounter++;
    return this.CONFIDENT_ACKS[idx];
  }

  _getInjectableContext(ld) {
    const priority = [
      { key: 'patient_type', template: "As a [VAL] patient," },
      { key: 'reason_for_visit', template: "Knowing that you're seeking care for [VAL]," },
      { key: 'insurance_provider', template: "For a patient with [VAL] coverage," },
      { key: 'dob', template: "Based on your records," }
    ];

    // Pick ONE context snippet (keeps responses tight)
    for (const p of priority) {
      const val = ld[p.key];
      if (val && !this.memory.usedContext.includes(val)) {
        this.memory.usedContext.push(val);
        if (this.memory.usedContext.length > 6) this.memory.usedContext.shift();
        return p.template.replace('[VAL]', val);
      }
    }
    return null;
  }

  _processOutcome(text) {
    if (this.memory.recentOutcomes.includes(text)) return null;
    this.memory.recentOutcomes.push(text);
    if (this.memory.recentOutcomes.length > 8) this.memory.recentOutcomes.shift();
    return text;
  }

  _buildQuestion(type, ld) {
    // CLOSE with known name — personalise
    if (type === 'CLOSE' && ld.name) {
      const pool = this._questionBank.CLOSE;
      const idx  = this._getQCounter('CLOSE_NAMED') % pool.length;
      const q    = pool[idx];
      return `${ld.name}, ${q.charAt(0).toLowerCase()}${q.slice(1)}`;
    }

    // Round-robin from the bank
    const pool = this._questionBank[type] || this._questionBank.DIAGNOSE;
    const idx  = this._getQCounter(type) % pool.length;
    return pool[idx];
  }

  _getQCounter(type) {
    if (this._questionCounters[type] === undefined) this._questionCounters[type] = 0;
    return this._questionCounters[type]++;
  }

  _assemble(components) {
    return components
      .filter(c => !!c)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
