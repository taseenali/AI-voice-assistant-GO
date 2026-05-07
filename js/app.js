/**
 * App Controller — Entry Point & UI Manager
 *
 * Wires together:
 *   - Config Engine (loaded FIRST — before anything else)
 *   - ConversationStateMachine
 *   - ResponseOrchestrator
 *   - SpeechIO
 *   - All UI elements
 *
 * Handles:
 *   - DOM event listeners
 *   - Chat rendering
 *   - Voice orb state management
 *   - Lead panel updates
 *   - State display
 *   - Dynamic UI branding via config
 */

import { ConversationStateMachine, STATES } from './state-machine.js';
import { ResponseOrchestrator }              from './response-orchestrator.js';
import { SpeechIO }                          from './speech-io.js';
import { AppContext, loadConfig, getClientFromURL } from './config/loader.js';

class App {

  constructor() {
    // ─── State (pre-init) ──────────────────────────────────
    this._voiceMode      = false;
    this._interimDisplay = null;
    this._isDebug        = false;
    
    this.currentInputId  = 0;
    this._currentThinkingBubble = null;

    // Boot the app asynchronously — config loads BEFORE engine init
    this._boot();
  }

  // ═══════════════════════════════════════════════════════════
  //  ASYNC BOOT — Config-first initialization
  // ═══════════════════════════════════════════════════════════

  async _boot() {
    try {
      // 1. Load config BEFORE anything else
      const clientId = getClientFromURL();
      const config = await loadConfig(clientId);
      AppContext.setConfig(config);

      console.log(`[App] Booted with client: "${clientId}" | Company: "${config.company_name}"`);

      // 2. Initialize core systems (config is now available globally)
      this.stateMachine = new ConversationStateMachine(config);
      this.orchestrator = new ResponseOrchestrator(this.stateMachine);
      this.speechIO     = new SpeechIO();

      // 3. Cache DOM references
      this._cacheDOMRefs();

      // 4. Apply config-driven branding to UI
      this._applyBranding(config);

      // 5. Wire up events
      this._bindEvents();
      this._setupSpeechCallbacks();
      this._setupStateListener();
      this._checkBrowserSupport();

      // 6. Gate first interaction behind a user gesture so Chrome TTS autoplay works.
      //    Tap-to-Start overlay calls _startConversation() on click.
      this._bindTapToStart();

    } catch (err) {
      console.error('[App] Critical boot failure:', err);
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;color:#ff4444;">
          <p>Failed to initialize. Please refresh the page.</p>
        </div>`;
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  DOM & BRANDING
  // ═══════════════════════════════════════════════════════════

  _cacheDOMRefs() {
    this.$orb           = document.getElementById('voice-orb');
    this.$orbCore       = document.getElementById('orb-core');
    this.$orbStatus     = document.getElementById('orb-status');
    this.$chatMessages  = document.getElementById('chat-messages');
    this.$textInput     = document.getElementById('text-input');
    this.$sendBtn       = document.getElementById('send-btn');
    this.$micBtn        = document.getElementById('mic-btn');
    this.$resetBtn      = document.getElementById('reset-btn');
    this.$stateDisplay  = document.getElementById('state-display');
    this.$engagementBar = document.getElementById('engagement-bar');
    this.$engagementVal = document.getElementById('engagement-value');
    this.$leadPanel     = document.getElementById('lead-panel');
    this.$leadName      = document.getElementById('lead-name');
    this.$leadPractice  = document.getElementById('lead-practice');
    this.$leadGoal      = document.getElementById('lead-goal');
    this.$leadProblem   = document.getElementById('lead-problem');
    this.$leadTimeline  = document.getElementById('lead-timeline');
    this.$leadTenure    = document.getElementById('lead-tenure');
    this.$leadScore     = document.getElementById('lead-score');
  }

  /**
   * Apply config-driven branding to the UI.
   * Replaces all hardcoded company references in the DOM.
   */
  _applyBranding(config) {
    // Header title
    const $title = document.querySelector('.header__title');
    if ($title) $title.textContent = config.company_name;

    // Header logo (first 2 chars or initials)
    const $logo = document.querySelector('.header__logo');
    if ($logo) {
      const words = config.company_name.split(' ');
      $logo.textContent = words.length >= 2
        ? words[0][0] + words[1][0]
        : config.company_name.substring(0, 2).toUpperCase();
    }

    // Page title
    document.title = `${config.company_name} — AI Voice Assistant`;

    // Meta description
    const $metaDesc = document.querySelector('meta[name="description"]');
    if ($metaDesc) {
      $metaDesc.setAttribute('content',
        `AI Voice Assistant for ${config.company_name} — Your intelligent medical receptionist powered by voice.`
      );
    }

    // Sidebar about text
    const $aboutCard = document.querySelector('.info-card:last-of-type p');
    if ($aboutCard) {
      $aboutCard.textContent = `I'm your AI-powered ${config.role || 'medical receptionist'}. I help coordinate your clinical care and scheduling.`;
    }

    // Footer
    const $footer = document.querySelector('.system-info a');
    if ($footer) $footer.textContent = config.company_name;
  }

  // ═══════════════════════════════════════════════════════════
  //  EVENT BINDING
  // ═══════════════════════════════════════════════════════════

  _bindEvents() {
    // Send button
    this.$sendBtn.addEventListener('click', () => this._handleSend());

    // Enter key
    this.$textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._handleSend();
      }
    });

    // Microphone button
    this.$micBtn.addEventListener('click', () => this._toggleVoice());

    // Reset button
    this.$resetBtn.addEventListener('click', () => this._resetConversation());

    // Orb click — start/stop voice
    this.$orb.addEventListener('click', () => this._toggleVoice());
  }

  _setupSpeechCallbacks() {
    this.speechIO.onResult = (transcript, isFinal) => {
      if (isFinal) {
        this._removeInterim();
        this._processUserInput(transcript);
      } else {
        this._showInterim(transcript);
      }
    };

    this.speechIO.onInterrupt = (partial) => {
      console.log('[Interrupt] Detected');
      console.log('[Interrupt] Speech cancelled');
      console.log('[Interrupt] Partial stored:', partial);
      this._processUserInput('__INTERRUPT__');
    };

    this.speechIO.onListenStart = () => {
      this._setOrbState('listening');
      this.$micBtn.classList.add('active');
    };

    this.speechIO.onListenStop = () => {
      if (!this.speechIO.isSpeaking) {
        this._setOrbState('idle');
      }
      this.$micBtn.classList.remove('active');
      this._voiceMode = false;
    };

    this.speechIO.onSpeakStart = () => {
      this._setOrbState('speaking');
    };

    this.speechIO.onSpeakEnd = () => {
      this._setOrbState('idle');
      // Auto-listen again if in voice mode
      if (this._voiceMode) {
        setTimeout(() => {
          if (this._voiceMode) this.speechIO.startListening();
        }, 500);
      }
    };
  }

  _setupStateListener() {
    this.stateMachine.onStateChange((oldState, newState, context) => {
      this._updateStateDisplay(newState);
      this._updateEngagement(context.engagementScore);
      this._updateLeadPanel(context.leadData);
      
      if (this._isDebug) this._updateDebugOverlay();

      // G-044: Handle Booking Confirmation Transition
      if (newState === STATES.BOOKING_CONFIRMATION) {
        this._checkCalendarAvailability();
      }
      
      // If we move from BOOKING_CONFIRMATION to ENDED (verbal yes), trigger book
      if (oldState === STATES.BOOKING_CONFIRMATION && newState === STATES.ENDED) {
        this._handleBookingConfirmation();
      }
    });
  }

  _checkBrowserSupport() {
    if (!this.speechIO.isRecognitionSupported) {
      this.$micBtn.classList.add('unsupported');
      this.$micBtn.title = 'Voice input not supported in this browser. Use Chrome or Edge.';
      this.$orbStatus.textContent = 'Text mode only';
    }
  }

  // P0-1: Gate first gesture so Chrome's TTS autoplay policy is satisfied.
  _bindTapToStart() {
    const overlay = document.getElementById('tap-to-start-overlay');
    const btn     = document.getElementById('tap-to-start-btn');
    const config  = AppContext.getConfig();

    // Update overlay title with loaded company name
    const titleEl = document.getElementById('tap-overlay-title');
    if (titleEl && config.company_name) titleEl.textContent = config.company_name;

    if (!overlay || !btn) {
      // Fallback: no overlay in DOM, start directly (text-mode safe)
      this._startConversation();
      return;
    }

    btn.addEventListener('click', () => {
      // Unlock audio synchronously while inside the user-gesture handler
      this.speechIO.unlockAudio();
      overlay.style.display = 'none';
      this._startConversation();
    }, { once: true });
  }

  // ═══════════════════════════════════════════════════════════
  //  CONVERSATION
  // ═══════════════════════════════════════════════════════════

  _startConversation() {
    const greeting = this.orchestrator.startConversation();
    this._addMessage('assistant', greeting);
    this._updateStateDisplay(this.stateMachine.getState());
    this._updateEngagement(50);

    // Speak greeting always
    if (greeting && typeof greeting === 'string') {
      this.speechIO.speak(greeting);
    }
    
    this._resetInactivityTimer();
  }

  _resetInactivityTimer() {
    if (this._inactivityTimer) clearTimeout(this._inactivityTimer);
    // 5 minutes of inactivity triggers a soft reset
    this._inactivityTimer = setTimeout(() => {
      console.log('[App] Session timed out due to inactivity. Resetting memory and state.');
      this._resetConversation();
    }, 5 * 60 * 1000);
  }

  _handleSend() {
    const text = this.$textInput.value.trim();
    if (!text || this._isProcessing) return;

    if (text.toLowerCase() === 'debug mode') {
      this._toggleDebugMode();
      this.$textInput.value = '';
      return;
    }

    // Unlock speech synthesis synchronously while still inside the user-gesture
    // handler. Chrome gates TTS on user activation; by the time speak() is called
    // (after the async processInput chain), the gesture window has closed.
    this.speechIO.unlockAudio();

    this.$textInput.value = '';
    this._processUserInput(text);
  }

  _toggleDebugMode() {
    this._isDebug = !this._isDebug;
    let dbg = document.getElementById('debug-overlay');
    
    if (!dbg) {
      dbg = document.createElement('div');
      dbg.id = 'debug-overlay';
      dbg.style.position = 'absolute';
      dbg.style.top = '20px';
      dbg.style.left = '20px';
      dbg.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
      dbg.style.color = '#00ffcc';
      dbg.style.padding = '15px';
      dbg.style.fontFamily = 'monospace';
      dbg.style.fontSize = '12px';
      dbg.style.lineHeight = '1.5';
      dbg.style.zIndex = '9999';
      dbg.style.borderRadius = '8px';
      dbg.style.border = '1px solid #00ffcc';
      document.body.appendChild(dbg);
    }
    
    dbg.style.display = this._isDebug ? 'block' : 'none';
    if (this._isDebug) this._updateDebugOverlay();
  }

  _updateDebugOverlay() {
    if (!this._isDebug) return;
    const ctx = this.stateMachine.getContext();
    const state = this.stateMachine.getState();
    const config = AppContext.getConfig();
    const dbg = document.getElementById('debug-overlay');
    if (dbg) {
      dbg.innerHTML = `
        <strong style="color: #fff">DEBUG MODE ACTIVE</strong><hr style="border-color:#333; margin:8px 0">
        <div><strong>Client:</strong> ${config.company_name || 'N/A'}</div>
        <div><strong>State:</strong> ${state}</div>
        <div><strong>Intent:</strong> ${ctx.intent || 'None'}</div>
        <div><strong>Goal:</strong> ${ctx.conversationGoal || 'None'}</div>
        <div><strong>Engagement:</strong> ${ctx.engagementScore}</div>
        <div><strong>Urgency:</strong> ${ctx.urgency || 'Normal'}</div>
      `;
    }
  }

  async _processUserInput(input) {
    this.currentInputId++;
    const inputId = this.currentInputId;
    
    this._resetInactivityTimer();

    // ── INTERRUPT MERGING ──
    if (input !== '__INTERRUPT__' && this.speechIO.interruptBuffer.timestamp > 0) {
      const elapsed = Date.now() - this.speechIO.interruptBuffer.timestamp;
      
      if (elapsed > 3000) {
        // Expired
        console.log('[Interrupt] Buffer expired (>3000ms)');
        this.speechIO.interruptBuffer.timestamp = 0;
        this.speechIO.interruptBuffer.mergedOnce = false;
      } else if (!this.speechIO.interruptBuffer.mergedOnce) {
        const clean = (str) => String(str).replace(/[-—]+$/, '').trim();
        input = clean(this.speechIO.interruptBuffer.partialTranscript) + " " + clean(input);
        console.log('[Interrupt] Merged input:', input);
        
        this.speechIO.interruptBuffer.mergedOnce = true;
        this.speechIO.interruptBuffer.timestamp = 0; // Fully consume the buffer
      }
    }

    // Optimally cancel pending delay immediately
    if (this._currentResolveDelay) {
      this._currentResolveDelay();
      this._currentResolveDelay = null;
      if (this._activeDelayTimer) clearTimeout(this._activeDelayTimer);
    }

    // 1. Interruption Handling
    if (this.speechIO.isSpeaking) {
      this.speechIO.cancelSpeech();
    }

    // 2. Clear old state
    this._clearThinking();
    this._addMessage('user', input);

    // Debounce thinking UI to prevent flicker
    setTimeout(() => {
      if (inputId === this.currentInputId) {
        this._setOrbState('thinking');
        this._currentThinkingBubble = this._addThinking();
      }
    }, 120);

    // 3. Detect intent complexity
    const wordCount = input.split(/\\s+/).length;
    let intent_complexity = 1;
    
    // Prevent breaking encapsulation: use orchestrator.intent locally for heuristical weight
    const nlpData = this.orchestrator.nlp.analyze(input, this.stateMachine.getContext());
    if (this.orchestrator.intent.isPositive(input) || this.orchestrator.intent.isNegative(input) || wordCount <= 3) {
      intent_complexity = 0;
    } else if (nlpData && nlpData.intentStrength === 'strong') {
      intent_complexity = 2; // High complexity logic trace
    }

    // 4. Calculate bounded delay
    let delayMs = 200 + (intent_complexity * 300) + (wordCount * 10);
    delayMs = Math.max(120, Math.min(1200, delayMs));

    console.log(`[Timing] Input received: ID ${inputId}`);
    console.log(`[Timing] Delay started: ${delayMs} ms (wordCount: ${wordCount}, complexity: ${intent_complexity})`);

    // 5. Await Delay (Cancellable)
    await new Promise(resolve => {
      this._currentResolveDelay = resolve;
      this._activeDelayTimer = setTimeout(() => {
        this._currentResolveDelay = null;
        resolve();
      }, delayMs);
    });

    // 6. Mandatory Stale Protection
    if (inputId !== this.currentInputId) {
      console.log('[Timing] Delay cancelled (new input). Response skipped (stale).');
      return; 
    }

    // 7. Generate Response Pipeline
    // onToken fires for each TTS-ready chunk streamed from the LLM proxy.
    // Rule: only fires if LLM streaming is active; rule-based responses use speak() below.
    let streamedSpeech = false;
    const onToken = (chunk) => {
      if (inputId !== this.currentInputId) return; // stale — discard
      streamedSpeech = true;
      this.speechIO.speakChunk(chunk);
    };

    let response = null;
    try {
      response = await this.orchestrator.processInput(input, onToken);
      console.log('[Timing] Response executed');
    } catch (pipelineErr) {
      console.error('[App] Pipeline error:', pipelineErr);
    }

    // Remove thinking indicator securely
    this._clearThinking();

    if (response) {
      this._addMessage('assistant', response);
      // Only call speak() if the LLM didn't already stream speech chunks
      if (!streamedSpeech && typeof response === 'string') {
        this.speechIO.speak(response);
      }
    }

    this._setOrbState('idle');
    this.$textInput.focus();
  }

  _clearThinking() {
    if (this._currentThinkingBubble) {
      this._removeThinking(this._currentThinkingBubble);
      this._currentThinkingBubble = null;
    }
  }

  _toggleVoice() {
    if (!this.speechIO.isRecognitionSupported) {
      this._addMessage('system', '⚠️ Voice input requires Chrome or Edge browser.');
      return;
    }

    if (this.speechIO.isListening) {
      this.speechIO.stopListening();
      this._voiceMode = false;
    } else {
      this._voiceMode = true;
      this.speechIO.startListening();
    }
  }

  _resetConversation() {
    this.orchestrator.reset();
    this.$chatMessages.innerHTML = '';
    this._capturingField = null;
    this._setOrbState('idle');
    this._updateLeadPanel({});
    this._startConversation();
  }

  // ═══════════════════════════════════════════════════════════
  //  UI RENDERING
  // ═══════════════════════════════════════════════════════════

  _addMessage(role, text) {
    const config = AppContext.getConfig();

    const wrapper = document.createElement('div');
    wrapper.className = `message message--${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'message__bubble';

    if (role === 'system') {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }

    const meta = document.createElement('div');
    meta.className = 'message__meta';
    meta.textContent = role === 'user' ? 'You' :
                       role === 'assistant' ? (config.company_name || 'Assistant') : 'System';

    wrapper.appendChild(bubble);
    wrapper.appendChild(meta);
    this.$chatMessages.appendChild(wrapper);

    // Scroll to bottom
    this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight;

    // Animate in
    requestAnimationFrame(() => wrapper.classList.add('message--visible'));

    return wrapper;
  }

  _addThinking() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message message--assistant message--thinking';

    const bubble = document.createElement('div');
    bubble.className = 'message__bubble thinking-bubble';
    bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

    wrapper.appendChild(bubble);
    this.$chatMessages.appendChild(wrapper);
    this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight;

    requestAnimationFrame(() => wrapper.classList.add('message--visible'));

    return wrapper;
  }

  _removeThinking(element) {
    if (element && element.parentNode) {
      element.remove();
    }
  }

  _showInterim(text) {
    if (!this._interimDisplay) {
      this._interimDisplay = document.createElement('div');
      this._interimDisplay.className = 'message message--user message--interim message--visible';

      const bubble = document.createElement('div');
      bubble.className = 'message__bubble';
      this._interimDisplay.appendChild(bubble);
      this.$chatMessages.appendChild(this._interimDisplay);
    }

    this._interimDisplay.querySelector('.message__bubble').textContent = text;
    this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight;
  }

  _removeInterim() {
    if (this._interimDisplay) {
      this._interimDisplay.remove();
      this._interimDisplay = null;
    }
  }

  _setOrbState(state) {
    const states = ['idle', 'listening', 'speaking', 'thinking'];
    states.forEach(s => this.$orb.classList.remove(`orb--${s}`));
    this.$orb.classList.add(`orb--${state}`);

    const statusMap = {
      idle:      'Ready',
      listening: 'Listening...',
      speaking:  'Speaking...',
      thinking:  'Thinking...'
    };
    this.$orbStatus.textContent = statusMap[state] || 'Ready';
  }

  _updateStateDisplay(state) {
    if (this.$stateDisplay) {
      const labels = {
        [STATES.IDLE]:            'Idle',
        [STATES.GREETING]:        'Greeting',
        [STATES.DISCOVERY]:       'Discovery',
        [STATES.INTENT_DETECTED]: 'Intent Detected',
        [STATES.FLOW_GENERAL]:    'General Inquiry',
        [STATES.LEAD_CAPTURE]:    'Lead Capture',
        [STATES.CLOSING]:         'Closing',
        [STATES.OBJECTION]:       'Handling Objection',
        [STATES.FALLBACK]:        'Recovery',
        [STATES.ENDED]:           'Ended'
      };
      this.$stateDisplay.textContent = labels[state] || state;
      this.$stateDisplay.dataset.state = state;
    }
  }

  _updateEngagement(score) {
    if (this.$engagementBar) {
      this.$engagementBar.style.width = `${score}%`;

      // Color based on score
      if (score >= 75)      this.$engagementBar.style.background = 'var(--accent-success)';
      else if (score >= 40) this.$engagementBar.style.background = 'var(--accent-primary)';
      else                  this.$engagementBar.style.background = 'var(--accent-danger)';
    }
    if (this.$engagementVal) {
      this.$engagementVal.textContent = `${Math.round(score)}%`;
    }
  }

  _updateLeadPanel(leadData) {
    if (!this.$leadPanel) return;

    const hasData = leadData && (leadData.name || leadData.medical_practice || leadData.care_goal || leadData.reason_for_visit);
    
    if (hasData) {
      this.$leadPanel.classList.add('lead-panel--active');
    }
    
    if (this.$leadName)     this.$leadName.textContent     = leadData.name               || '—';
    if (this.$leadPractice) this.$leadPractice.textContent = leadData.medical_practice   || '—';
    if (this.$leadGoal)     this.$leadGoal.textContent      = leadData.dob                || '—';
    if (this.$leadProblem)  this.$leadProblem.textContent   = leadData.reason_for_visit   || '—';
    if (this.$leadTimeline) this.$leadTimeline.textContent  = leadData.insurance_provider || '—';
    if (this.$leadTenure)   this.$leadTenure.textContent    = leadData.urgency            || '—';

    if (this.$leadScore) {
      const completeness = this.orchestrator.getLeadCompleteness();
      this.$leadScore.textContent = `${completeness}%`;
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  CALENDAR INTEGRATION (G-044)
  // ═══════════════════════════════════════════════════════════

  async _checkCalendarAvailability() {
    const ctx = this.stateMachine.getContext();
    const config = AppContext.getConfig();
    const appointment_time = ctx.leadData.appointment_time;
    const startTime = ctx.leadData.appointment_iso;
    
    if (!startTime) {
      console.warn('[App] No ISO time extracted. Skipping availability check.');
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log(`[App] Checking availability for ${appointment_time} (${startTime})`);
      const response = await fetch('/api/calendar/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          calendar_id: config.calendar_id, 
          startTime,
          endTime: new Date(new Date(startTime).getTime() + 30 * 60000).toISOString() // +30 mins
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.available) {
        console.log('[App] Slot is available');
        this._lastCalendarResult = result;
      } else {
        console.warn('[App] Slot is BUSY');
        this._lastCalendarResult = result;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[App] Availability check failed:', err.name === 'AbortError' ? 'Timeout' : err.message);
    }
  }

  async _handleBookingConfirmation() {
    const ctx = this.stateMachine.getContext();
    const config = AppContext.getConfig();
    const ld = ctx.leadData;

    console.log('[App] Verbal confirmation received. Creating calendar event...');

    try {
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendar_id: config.calendar_id,
          startTime: ld.appointment_iso,
          endTime: new Date(new Date(ld.appointment_iso).getTime() + 30 * 60000).toISOString(),
          patientName: ld.name,
          reason: ld.reason_for_visit,
          leadId: Date.now() // Simple unique ID
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('[App] Booking SUCCESS:', result.eventId);
        this._addMessage('system', '📅 <strong>Appointment Confirmed</strong><br>Your visit has been scheduled on the clinic calendar.');
      } else {
        console.error('[App] Booking FAILED:', result.message || result.error);
        this._addMessage('system', `⚠️ <strong>Booking Error</strong><br>${result.message || 'The system was unable to create the event. Staff have been notified.'}`);
      }
    } catch (err) {
      console.error('[App] Booking request failed:', err.message);
      this._addMessage('system', '⚠️ <strong>Connection Error</strong><br>Failed to reach the calendar service.');
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════════════════════

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
