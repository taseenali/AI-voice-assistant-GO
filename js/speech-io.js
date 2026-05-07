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
    this._activeSpeechToken = 0;

    this.interruptBuffer = {
      isInterrupted: false,
      partialTranscript: "",
      timestamp: 0,
      mergedOnce: false
    };

    // Callbacks
    this.onResult      = null;   // (transcript, isFinal) => {}
    this.onInterrupt   = null;   // (partialTranscript) => {}
    this.onListenStart = null;
    this.onListenStop  = null;
    this.onSpeakStart  = null;
    this.onSpeakEnd    = null;
    this.onError       = null;
    // SEC-04: Fired when voice fails hard (not-allowed, network) — triggers text-only fallback
    this.onPrivacyFallback = null;

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
        if (this._isMeaningfulInterrupt(text)) {
          console.log('[SpeechIO] Interrupted by user:', text);
          
          this.interruptBuffer.isInterrupted = true;
          this.interruptBuffer.partialTranscript = text;
          this.interruptBuffer.timestamp = Date.now();
          this.interruptBuffer.mergedOnce = false;
          
          this.cancelSpeech();
          
          if (this.onInterrupt) {
            this.onInterrupt(text);
          }
        }
      }

      // Reset buffer on final input if it matches interrupt text length bounds
      if (isFinal) {
        this.interruptBuffer.isInterrupted = false;
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
      // SEC-04: Hard errors (not-allowed, network) indicate voice is unavailable or denied.
      // Trigger text-only fallback path. 'no-speech' and 'aborted' are non-fatal.
      const hardErrors = ['not-allowed', 'service-not-allowed', 'network', 'audio-capture'];
      if (hardErrors.includes(event.error)) {
        console.warn('[SpeechIO] Hard recognition error — routing to text fallback:', event.error);
        if (this.onPrivacyFallback) this.onPrivacyFallback(event.error);
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
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

  // ─── Public: Audio Unlock ─────────────────────────────────

  /**
   * Call this synchronously inside a user-gesture handler (click/keydown) BEFORE
   * any async work. Chrome gates speechSynthesis on user activation; firing a
   * near-silent utterance here keeps the engine warm for the async speak() call
   * that follows after processInput() resolves.
   */
  unlockAudio() {
    if (!this._synthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      u.rate   = 16;
      if (this._selectedVoice) u.voice = this._selectedVoice;
      this._synthesis.speak(u);
    } catch (_) {}
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
      // G-015/G-030: Proactive iOS / Safari Fallback
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS || e.name === 'NotAllowedError') {
        console.warn('[SpeechIO] iOS or NotAllowed fallback triggered proactively.');
        if (this.onPrivacyFallback) this.onPrivacyFallback('not-allowed');
      }
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

    this.stopSpeaking();
    this._cancelPlayback = false;
    this._isSpeaking     = true;
    this._activeSpeechToken++;
    const currentToken   = this._activeSpeechToken;

    if (this.onSpeakStart) this.onSpeakStart();

    try {
      if (!this._selectedVoice) this._loadVoices();

      const wordCount = text.split(/\s+/).length;

      // Short thinking pause — audio engine is already warm from unlockAudio()
      // called synchronously in the user-gesture handler before this async chain.
      const delay = wordCount <= 5 ? this._randWait(100, 250) : this._randWait(200, 450);
      await this._wait(delay);
      if (this._cancelPlayback) return;

      const chunks = wordCount <= 15 || !/[.,;:—]/.test(text)
        ? [text]
        : this._chunkText(text);

      for (let i = 0; i < chunks.length; i++) {
        if (this._cancelPlayback || currentToken !== this._activeSpeechToken) break;
        await this._speakUtterance(chunks[i], i, chunks.length, currentToken);
        if (this._cancelPlayback || currentToken !== this._activeSpeechToken) break;

        if (i < chunks.length - 1) {
          const heavy = /[.!?;:—]$/.test(chunks[i].trim());
          await this._wait(heavy ? this._randWait(80, 150) : this._randWait(30, 80));
        }
      }

      if (!this._cancelPlayback && currentToken === this._activeSpeechToken) {
        await this._wait(this._randWait(100, 180));
      }
    } catch (err) {
      console.error("Speech error:", err);
    } finally {
      if (!this._cancelPlayback && currentToken === this._activeSpeechToken) {
        this._isSpeaking = false;
        if (this.onSpeakEnd) this.onSpeakEnd();
      }
    }
  }

  _speakUtterance(textChunk, idx, total, token) {
    return new Promise((resolve) => {
      if (token !== this._activeSpeechToken) return resolve();
      const utterance  = new SpeechSynthesisUtterance(textChunk);
      
      // Re-check voices at speak-time — Chrome loads them asynchronously
      // so the constructor snapshot may have been empty on the first utterance.
      if (!this._selectedVoice) this._loadVoices();
      if (this._selectedVoice) utterance.voice = this._selectedVoice;
      
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

  /**
   * Speak a single TTS chunk immediately (used by LLM streaming onToken).
   * Queues utterances without resetting the active speech token so sequential
   * chunks play in order without gaps.
   */
  speakChunk(text) {
    if (!this._synthesis || !text || !text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text.trim());
    if (!this._selectedVoice) this._loadVoices();
    if (this._selectedVoice) utterance.voice = this._selectedVoice;
    utterance.rate   = 0.95;
    utterance.pitch  = 1.0;
    utterance.volume = 1.0;
    if (!this._isSpeaking) {
      this._isSpeaking = true;
      if (this.onSpeakStart) this.onSpeakStart();
    }
    utterance.onend = () => {
      // Only fire onSpeakEnd when the synthesis queue drains completely
      if (!this._synthesis.speaking) {
        this._isSpeaking = false;
        if (this.onSpeakEnd) this.onSpeakEnd();
      }
    };
    this._synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this._synthesis) {
      this._synthesis.cancel();
      this._cancelPlayback = true;
      this._activeSpeechToken++; // Instantly invalidate pending chunks
      if (this._isSpeaking) {
        this._isSpeaking = false;
        if (this.onSpeakEnd) this.onSpeakEnd();
      }
    }
  }

  cancelSpeech() {
    this.stopSpeaking();
  }

  // ─── Internal Utility ───────────────────────────────────────

  _isMeaningfulInterrupt(text) {
    const words = text.split(/\s+/).filter(Boolean);
    const fillers = new Set(['uh', 'um', 'uhh', 'umm', 'ahh', 'ah', 'err', 'erm', 'like', 'so', 'well', 'okay', 'ok', 'yeah']);
    const meaningful = words.filter(w => !fillers.has(w.toLowerCase()));
    
    // Trigger interrupt if there are at least 2 meaningful tokens (or a very long fast string)
    return meaningful.length >= 2 || words.length >= 4; 
  }

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

  /**
   * SEC-04: Returns the standardized privacy disclosure string.
   * Must be shown in the UI before or at the point the mic is activated.
   */
  getPrivacyNotice() {
    return 'Voice interactions are processed by your browser and may be sent to a third-party speech recognition service. You can use text input at any time.';
  }
}
