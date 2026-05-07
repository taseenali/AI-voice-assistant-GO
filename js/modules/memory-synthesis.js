/**
 * Memory Synthesis Layer (Phase 2)
 *
 * Tracks user-provided entities and state deterministically.
 * Prevents repeating questions and evaluates confidence for memory overrides.
 */

export class MemorySynthesis {
  constructor() {
    this._MAX_ENTITIES = 20;

    // We store entities in a Map to retain insertion order for LRU-like eviction
    this.memoryState = {
      short_term: new Map(),
      user_state: {
        frustration_strikes: 0,
        engagement_trend: 'stable',
        cadence: 'slow'
      }
    };
  }

  /**
   * Store an entity in short-term memory.
   * Ensures that newer values override older ones ONLY if confidence >= previous.
   * Manages buffer bounds to prevent overflow crashes.
   */
  storeEntity(key, value, confidence, turn) {
    if (!key || value === undefined || value === null) return;
    
    key = String(key).toLowerCase().trim();
    confidence = confidence ?? 0.5;

    const current = this.memoryState.short_term.get(key);

    if (current) {
      if (current.value === value) return; // Prevent noisy overwrite loops
      
      if (turn >= current.turn_acquired && confidence >= current.confidence) {
        // Valid override
        this.memoryState.short_term.set(key, { value, confidence, turn_acquired: turn });
        console.log(`[Memory] Stored: ${key}=${value} (Override successful)`);
      } else {
        console.log(`[Memory] Skipped overwrite for ${key} (lower confidence or older turn)`);
      }
    } else {
      // New insertion
      this._enforceLimit();
      this.memoryState.short_term.set(key, { value, confidence, turn_acquired: turn });
      console.log(`[Memory] Stored: ${key}=${value}`);
    }
  }

  /**
   * Check if an entity exists.
   */
  hasEntity(key) {
    if (!key) return false;
    return this.memoryState.short_term.has(String(key).toLowerCase().trim());
  }

  /**
   * Retrieve an entity's value.
   */
  getEntity(key) {
    if (!key) return null;
    key = String(key).toLowerCase().trim();
    const entity = this.memoryState.short_term.get(key);
    if (entity) {
      console.log(`[Memory] Retrieved: ${key}=${entity.value}`);
      return entity.value;
    }
    return null;
  }

  /**
   * Retrieve an entity object including metadata (confidence, turn_acquired).
   * Useful for strict qualification checks.
   */
  getEntityWithMeta(key) {
    if (!key) return null;
    return this.memoryState.short_term.get(String(key).toLowerCase().trim()) || null;
  }

  /**
   * Updates rolling human behavioral state.
   */
  updateUserState(inputAnalysis) {
    if (!inputAnalysis) return;

    const st = this.memoryState.user_state;

    // Track Frustration & Hesitation via userType signal
    if (inputAnalysis.userType === 'frustrated' || inputAnalysis.intent === 'NEGATIVE') {
      st.frustration_strikes++;
    } else if (inputAnalysis.intent === 'POSITIVE' || inputAnalysis.userType === 'direct') {
      // Decay frustration smoothly
      st.frustration_strikes = Math.max(0, st.frustration_strikes - 1);
    }

    // Engagement Trend (proxying intent signal strength and detail quality)
    if (inputAnalysis.quality && inputAnalysis.quality.detail === 'high') {
      st.engagement_trend = 'rising';
    } else if (inputAnalysis.quality && inputAnalysis.quality.detail === 'low') {
      st.engagement_trend = 'falling';
    } else {
      st.engagement_trend = 'stable';
    }

    // Cadence
    if (inputAnalysis.quality && inputAnalysis.quality.words > 10) {
      st.cadence = 'fast'; 
    } else if (inputAnalysis.quality && inputAnalysis.quality.words <= 3) {
      st.cadence = 'slow';
    }
  }

  /**
   * Returns complete memory snapshot for debugging or cross-layer context analysis.
   */
  getSnapshot() {
    return JSON.parse(JSON.stringify({
      short_term: Object.fromEntries(this.memoryState.short_term),
      user_state: this.memoryState.user_state
    }));
  }

  /**
   * Internal routine enforcing max 20 entities boundary (FIFO eviction).
   */
  _enforceLimit() {
    if (this.memoryState.short_term.size >= this._MAX_ENTITIES) {
      // Map iteration returns keys in insertion order. The first is the oldest.
      const oldestKey = this.memoryState.short_term.keys().next().value;
      this.memoryState.short_term.delete(oldestKey);
      console.log(`[Memory] Evicted oldest entity: ${oldestKey} to maintain memory boundary.`);
    }
  }

  reset() {
    this.memoryState.short_term.clear();
    this.memoryState.user_state = {
      frustration_strikes: 0,
      engagement_trend: 'stable',
      cadence: 'slow'
    };
  }
}
