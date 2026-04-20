/**
 * Speech I/O Module
 * Wraps the Web Speech API for voice input (recognition) and output (synthesis).
 * Phase 1: Stub with full interface. Phase 4: Full implementation.
 */

export class SpeechIO {

  constructor() {
    this._recognition  = null;
    this._synthesis     = window.speechSynthesis || null;
    this._isListening   = false;
    this._isSpeaking    = false;
    this._selectedVoice = null;
    this._voices        = [];

    // Callbacks
    this.onResult     = null;   // (transcript, isFinal) => {}
    this.onListenStart = null;
    this.onListenStop  = null;
    this.onSpeakStart  = null;
    this.onSpeakEnd    = null;
    this.onError       = null;

    this._initRecognition();
    this._loadVoices();
  }

  // ─── Browser Support ──────────────────────────────────────

  get isRecognitionSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  get isSynthesisSupported() {
    return !!this._synthesis;
  }

  get isListening() {
    return this._isListening;
  }

  get isSpeaking() {
    return this._isSpeaking;
  }

  // ─── Recognition Setup ────────────────────────────────────

  _initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this._recognition = new SpeechRecognition();
    this._recognition.continuous     = false;
    this._recognition.interimResults = true;
    this._recognition.lang           = 'en-US';
    this._recognition.maxAlternatives = 1;

    this._recognition.onresult = (event) => {
      const last    = event.results[event.results.length - 1];
      const text    = last[0].transcript.trim();
      const isFinal = last.isFinal;

      // Interruptibility check: Stop if user starts speaking over the assistant
      if (!isFinal && this._isSpeaking) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 2) {
          console.log('[SpeechIO] Interrupted by user:', text);
          setTimeout(() => {
            this.stopSpeaking();
          }, 150);
        }
      }

      if (this.onResult) {
        this.onResult(text, isFinal);
      }
    };

    this._recognition.onstart = () => {
      this._isListening = true;
      if (this.onListenStart) this.onListenStart();
    };

    this._recognition.onend = () => {
      this._isListening = false;
      if (this.onListenStop) this.onListenStop();
    };

    this._recognition.onerror = (event) => {
      this._isListening = false;
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('[SpeechIO] Recognition error:', event.error);
        if (this.onError) this.onError(event.error);
      }
      if (this.onListenStop) this.onListenStop();
    };
  }

  // ─── Voice Loading ────────────────────────────────────────

  _loadVoices() {
    if (!this._synthesis) return;

    const load = () => {
      this._voices = this._synthesis.getVoices();
      // Prefer a natural-sounding English voice
      this._selectedVoice =
        this._voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
        this._voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
        this._voices.find(v => v.lang.startsWith('en')) ||
        this._voices[0] || null;
    };

    load();
    if (this._synthesis.onvoiceschanged !== undefined) {
      this._synthesis.onvoiceschanged = () => {
        load();
      };
    }
  }

  // ─── Public: Listen ───────────────────────────────────────

  startListening() {
    if (!this._recognition) {
      console.warn('[SpeechIO] Speech recognition not supported.');
      return false;
    }
    if (this._isListening) return true;

    // Stop speaking if we're speaking
    if (this._isSpeaking) {
      this.stopSpeaking();
    }

    try {
      this._recognition.start();
      return true;
    } catch (e) {
      console.error('[SpeechIO] Failed to start recognition:', e);
      return false;
    }
  }

  stopListening() {
    if (this._recognition && this._isListening) {
      try { this._recognition.stop(); } catch (_) {}
    }
    this._isListening = false;
  }

  // ─── Public: Speak ────────────────────────────────────────

  async speak(text) {
    if (!this._synthesis) return;

    console.log("SPEAK CALLED:", text);

    this.stopSpeaking();
    this._cancelPlayback = false;
    this._isSpeaking = true;
    if (this.onSpeakStart) this.onSpeakStart();

    try {
      // 0. Force Browser Audio Unlock (immediately use synthesis within synchronous gesture payload)
      const unlockUtterance = new SpeechSynthesisUtterance('');
      unlockUtterance.volume = 0;
      this._synthesis.speak(unlockUtterance);

      // 1. Simulated Thinking Delay based on input length (widened variance for realism)
      const wordCount = text.split(/\s+/).length;
      let initialDelay = this._randWait(250, 600);
      if (wordCount > 5) initialDelay = this._randWait(400, 900);
      if (wordCount > 12) initialDelay = this._randWait(700, 1300);

      await this._wait(initialDelay);
      if (this._cancelPlayback) return;

      // 2. Chunking Logic (Bypass if short or simple)
      let chunks;
      if (wordCount <= 10 || !/[.,;:—]/.test(text)) {
        chunks = [text]; // Speak entirely natively to avoid stilted pacing
      } else {
        chunks = this._chunkText(text);
      }

      console.log("CHUNKS:", chunks);

      // 3. Process Chunks with Variation
      for (const chunk of chunks) {
        if (this._cancelPlayback) break;

        await this._speakUtterance(chunk, chunks.indexOf(chunk), chunks.length);

        if (this._cancelPlayback) break;

        // 4. Structured Pauses
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          const isHeavyBreak = /[.!?;:—]$/.test(chunk.trim());
          const pauseLength = isHeavyBreak ? this._randWait(250, 400) : this._randWait(150, 250);
          await this._wait(pauseLength);
        }
      }

      // 5. Conversational Breathing Space (200-400ms max)
      if (!this._cancelPlayback) {
        await this._wait(this._randWait(200, 400));
      }
    } catch (err) {
      console.error("Speech error:", err);
    } finally {
      if (!this._cancelPlayback) {
        this._isSpeaking = false;
        if (this.onSpeakEnd) this.onSpeakEnd();
      }
    }
  }

  _speakUtterance(textChunk, idx, total) {
    return new Promise((resolve) => {
      const utterance  = new SpeechSynthesisUtterance(textChunk);
      
      if (this._selectedVoice) {
        utterance.voice  = this._selectedVoice;
      }
      
      // Delivery Variation: subtle rate/pitch weighting
      let rate = 0.95;
      let pitch = 1.0;
      
      if (idx === 0 && total > 1) {
        rate = 0.97; // Slightly faster to start thought
        pitch = 1.02; // Elevated pitch
      } else if (idx === total - 1 && total > 1) {
        rate = 0.93; // Slower near the end
        pitch = 0.97; // Lowered pitch
      }

      utterance.rate   = rate;
      utterance.pitch  = pitch;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.error('[SpeechIO] Synthesis chunk error:', e.error);
        }
        resolve();
      };

      this._synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this._synthesis) {
      this._synthesis.cancel();
      this._cancelPlayback = true;
      if (this._isSpeaking) {
        this._isSpeaking = false;
        if (this.onSpeakEnd) this.onSpeakEnd();
      }
    }
  }

  // ─── Internal Utility ───────────────────────────────────────

  _chunkText(text) {
    // Split on common natural breaks
    const parts = text.split(/(?<=[.,!?;—:-])\s+/);
    if (parts.length <= 1) return parts;

    let chunks = [];
    let current = '';

    for (const p of parts) {
      current = current ? current + ' ' + p : p;
      // Break segment if length > 3 words and we have a valid chunk
      if (current.split(/\s+/).length >= 4) {
        chunks.push(current);
        current = '';
      }
    }
    if (current) chunks.push(current);

    // Limit to max 3 chunks to prevent over-fragmenting
    if (chunks.length > 3) {
      const finalChunk = chunks.slice(2).join(' ');
      chunks = [chunks[0], chunks[1], finalChunk];
    }
    return chunks;
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _randWait(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ─── Public: Voices ───────────────────────────────────────

  getVoices() {
    return this._voices.filter(v => v.lang.startsWith('en'));
  }

  setVoice(voice) {
    this._selectedVoice = voice;
  }
}
