/**
 * Demo data seed script.
 * Run: node server/scripts/seed-demo.js
 * Requires the server to have booted at least once (tenants table must be populated).
 */
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../data/medvoice.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Helpers ────────────────────────────────────────────────────────────────

function ago(days, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function future(days, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function endTime(start, durationSec) {
  return new Date(new Date(start).getTime() + durationSec * 1000).toISOString();
}

// ─── Clinic definitions ──────────────────────────────────────────────────────

const CLINICS = ['medical-clinic', 'northgate-family-health', 'sunrise-dental'];

// ─── Session + lead data per clinic ─────────────────────────────────────────

const DATA = {
  'medical-clinic': {
    sessions: [
      {
        patient: 'Sarah Chen', phone: '+16045550101', reason: 'Annual physical exam',
        daysAgo: 1, hour: 9,  duration: 284, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Hello, you've reached Valley Medical Center. I'm Aria, the virtual receptionist. How can I help you today?" },
          { role: 'user',      msg: "Hi, I'd like to book an appointment for my annual physical." },
          { role: 'assistant', msg: "Of course! I'd be happy to help schedule that. Can I get your name and a callback number?" },
          { role: 'user',      msg: "I'm Sarah Chen. My number is 604-555-0101." },
          { role: 'assistant', msg: "Thank you Sarah. I have you booked for an annual physical on Thursday at 10:30 AM. You'll receive a confirmation. Is there anything else I can help with?" },
          { role: 'user',      msg: "No, that's perfect. Thank you!" },
        ],
      },
      {
        patient: 'Marcus Williams', phone: '+16045550202', reason: 'Medication refill — blood pressure',
        daysAgo: 1, hour: 11, duration: 178, booked: false, type: 'returning',
        turns: [
          { role: 'assistant', msg: "Valley Medical Center, this is Aria. How can I assist you?" },
          { role: 'user',      msg: "I need a refill on my blood pressure medication." },
          { role: 'assistant', msg: "I can log that for the team. Can I get your name and best contact number?" },
          { role: 'user',      msg: "Marcus Williams, 604-555-0202." },
          { role: 'assistant', msg: "Got it Marcus. I've noted your medication refill request. The care team will review and contact you within one business day." },
        ],
      },
      {
        patient: 'Priya Patel', phone: '+16045550303', reason: 'Follow-up — thyroid results',
        daysAgo: 2, hour: 14, duration: 312, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Hello, Valley Medical Center. This is Aria. How can I help you?" },
          { role: 'user',      msg: "I need to book a follow-up. My doctor ordered thyroid bloodwork and I have the results." },
          { role: 'assistant', msg: "Of course. I can schedule a follow-up appointment. What's your name and phone number?" },
          { role: 'user',      msg: "Priya Patel. 604-555-0303." },
          { role: 'assistant', msg: "Thanks Priya. I've checked and Dr. Chen has availability Friday at 2:00 PM. Does that work?" },
          { role: 'user',      msg: "Yes, that works perfectly." },
          { role: 'assistant', msg: "Wonderful. You're booked Friday at 2 PM for a thyroid follow-up. See you then!" },
        ],
      },
      {
        patient: 'David Kim',    phone: '+16045550404', reason: 'Chest pain — emergency',
        daysAgo: 2, hour: 16, duration: 98,  booked: false, type: 'new',    emergency: true,
        turns: [
          { role: 'assistant', msg: "Valley Medical Center. This is Aria. How can I help?" },
          { role: 'user',      msg: "I've been having chest pain since this morning. It's getting worse." },
          { role: 'assistant', msg: "I'm very concerned to hear that. Chest pain can be a serious medical emergency. Please call 911 immediately or have someone take you to the nearest emergency room right away. Do not drive yourself." },
          { role: 'user',      msg: "Okay, okay." },
          { role: 'assistant', msg: "Please act now — call 911. I'm flagging this for the on-call team as well. Is there someone with you who can help?" },
        ],
      },
      {
        patient: 'Emma Thompson', phone: '+16045550505', reason: 'Persistent headaches',
        daysAgo: 3, hour: 10, duration: 256, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Hi, Valley Medical Center. I'm Aria. How can I assist you today?" },
          { role: 'user',      msg: "I've been having really bad headaches for about two weeks. I'd like to see a doctor." },
          { role: 'assistant', msg: "I understand. I can get you an appointment. Your name and phone number, please?" },
          { role: 'user',      msg: "Emma Thompson. 604-555-0505." },
          { role: 'assistant', msg: "Thanks Emma. I have an opening Tuesday at 9:30 AM. Can you make that?" },
          { role: 'user',      msg: "Yes, Tuesday morning works." },
          { role: 'assistant', msg: "You're booked Tuesday at 9:30 AM for headache evaluation. Take care, Emma." },
        ],
      },
      {
        patient: 'Robert Osei',  phone: '+16045550606', reason: 'New patient — general assessment',
        daysAgo: 4, hour: 9,  duration: 397, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Valley Medical Center, Aria speaking. How can I help?" },
          { role: 'user',      msg: "I just moved to the area and I'm looking for a new family doctor." },
          { role: 'assistant', msg: "Welcome! We're happy to take new patients. Can I get your name and a phone number?" },
          { role: 'user',      msg: "Robert Osei. 604-555-0606." },
          { role: 'assistant', msg: "Great to meet you Robert. Our earliest new patient slot is next Monday at 10 AM. Would that work?" },
          { role: 'user',      msg: "Monday at 10, yes that's fine." },
          { role: 'assistant', msg: "You're all set. Booked for Monday at 10 AM for a new patient assessment. We'll send a confirmation and a short intake form by email." },
        ],
      },
      {
        patient: 'Amara Hassan', phone: '+16045550707', reason: 'Prescription renewal — diabetes',
        daysAgo: 5, hour: 13, duration: 203, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Hello, Valley Medical Center. This is Aria." },
          { role: 'user',      msg: "I need to renew my diabetes prescription. I'm almost out." },
          { role: 'assistant', msg: "I can help with that. Name and phone number?" },
          { role: 'user',      msg: "Amara Hassan. 604-555-0707." },
          { role: 'assistant', msg: "Thank you Amara. I've flagged this as urgent given you're running low. The care team will process this today and call you to confirm." },
        ],
      },
      {
        patient: 'Lisa Nakamura', phone: '+16045550808', reason: 'Skin rash, spreading',
        daysAgo: 6, hour: 11, duration: 234, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Valley Medical Center. Aria here. How can I help?" },
          { role: 'user',      msg: "I have a rash that's been spreading for three days. I'm worried." },
          { role: 'assistant', msg: "I understand. That sounds like something the doctor should look at soon. May I have your name and number?" },
          { role: 'user',      msg: "Lisa Nakamura. 604-555-0808." },
          { role: 'assistant', msg: "Lisa, I can get you in tomorrow at 2:30 PM. Does that work?" },
          { role: 'user',      msg: "Yes, please." },
          { role: 'assistant', msg: "Booked for tomorrow at 2:30 PM. If the rash worsens significantly before then, please go to urgent care." },
        ],
      },
    ],
    appointments: [
      { patient: 'Sarah Chen',     reason: 'Annual physical exam',       daysAhead: 3, hour: 10, min: 30 },
      { patient: 'Emma Thompson',  reason: 'Headache evaluation',        daysAhead: 5, hour: 9,  min: 30 },
      { patient: 'Robert Osei',    reason: 'New patient assessment',     daysAhead: 7, hour: 10, min: 0  },
      { patient: 'Priya Patel',    reason: 'Thyroid follow-up',          daysAhead: 2, hour: 14, min: 0  },
      { patient: 'Lisa Nakamura',  reason: 'Skin rash evaluation',       daysAhead: 1, hour: 14, min: 30 },
    ],
  },

  'northgate-family-health': {
    sessions: [
      {
        patient: 'Tyler Johnson',  phone: '+16045551101', reason: 'Well-child visit — 4 years old',
        daysAgo: 1, hour: 9,  duration: 267, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Northgate Family Health. This is Aria. How can I help you today?" },
          { role: 'user',      msg: "Hi, I need to book a well-child appointment for my four-year-old." },
          { role: 'assistant', msg: "Of course! We love seeing the little ones. Can I get your name and a contact number?" },
          { role: 'user',      msg: "I'm Jamie Johnson, his mom. Number is 604-555-1101." },
          { role: 'assistant', msg: "Thanks Jamie. We have Thursday at 9:00 AM open for a well-child visit. Would that work for Tyler?" },
          { role: 'user',      msg: "Thursday at 9 is perfect." },
          { role: 'assistant', msg: "Wonderful. Tyler Johnson is booked Thursday at 9 AM. See you then!" },
        ],
      },
      {
        patient: 'Sophie Williams', phone: '+16045551202', reason: 'Annual flu shot',
        daysAgo: 1, hour: 14, duration: 145, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Northgate Family Health, Aria speaking. How can I help?" },
          { role: 'user',      msg: "I'd like to come in for a flu shot." },
          { role: 'assistant', msg: "Great timing! We have walk-in flu shot hours Wednesday 10 AM to 2 PM. Would that work?" },
          { role: 'user',      msg: "Yes, Wednesday works. My name is Sophie Williams." },
          { role: 'assistant', msg: "Perfect Sophie. You're all set for Wednesday. No appointment needed — just come in during that window and we'll take care of you." },
        ],
      },
      {
        patient: 'Rachel Lee',     phone: '+16045551303', reason: 'First prenatal visit — 8 weeks',
        daysAgo: 2, hour: 10, duration: 389, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Hello, Northgate Family Health. I'm Aria." },
          { role: 'user',      msg: "I just found out I'm pregnant, about 8 weeks. I need to book my first prenatal appointment." },
          { role: 'assistant', msg: "Congratulations! We'll take great care of you. Can I get your name and number?" },
          { role: 'user',      msg: "Rachel Lee. 604-555-1303." },
          { role: 'assistant', msg: "Thank you Rachel. Dr. Patel has a prenatal intake slot next Tuesday at 11 AM. Shall I book that?" },
          { role: 'user',      msg: "Yes please." },
          { role: 'assistant', msg: "You're booked Tuesday at 11 AM for your first prenatal visit. Congratulations again!" },
        ],
      },
      {
        patient: 'Maya Patel',    phone: '+16045551404', reason: 'Severe abdominal pain — emergency',
        daysAgo: 3, hour: 15, duration: 112, booked: false, type: 'new',    emergency: true,
        turns: [
          { role: 'assistant', msg: "Northgate Family Health. This is Aria." },
          { role: 'user',      msg: "My daughter is having really bad stomach pain, she can barely move." },
          { role: 'assistant', msg: "That sounds serious and could be a medical emergency. Please take her to the emergency room or call 911 immediately — do not wait. Severe abdominal pain that prevents movement needs urgent evaluation." },
          { role: 'user',      msg: "Okay, we're going now." },
          { role: 'assistant', msg: "Please go right away. I'm flagging this for our on-call team as well. I hope she feels better very soon." },
        ],
      },
      {
        patient: 'Michael Brown', phone: '+16045551505', reason: 'Blood pressure check — follow-up',
        daysAgo: 4, hour: 11, duration: 198, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Northgate Family Health, Aria speaking." },
          { role: 'user',      msg: "I need a follow-up for my blood pressure. My doctor wanted to check it again in 6 weeks." },
          { role: 'assistant', msg: "Of course. Name and best number?" },
          { role: 'user',      msg: "Michael Brown. 604-555-1505." },
          { role: 'assistant', msg: "Michael, I have next Monday at 2:30 PM for a blood pressure follow-up. Would that work?" },
          { role: 'user',      msg: "Monday at 2:30, yes that's fine." },
          { role: 'assistant', msg: "You're all set. See you Monday at 2:30 PM." },
        ],
      },
      {
        patient: 'Kevin O\'Brien', phone: '+16045551606', reason: 'Allergy testing consultation',
        daysAgo: 5, hour: 9,  duration: 166, booked: false, type: 'new',
        turns: [
          { role: 'assistant', msg: "Northgate Family Health. How can I help?" },
          { role: 'user',      msg: "I think I have some kind of allergy. Can I get tested?" },
          { role: 'assistant', msg: "Absolutely. We can arrange a consultation. Can I get your name and number?" },
          { role: 'user',      msg: "Kevin O'Brien. 604-555-1606." },
          { role: 'assistant', msg: "Thanks Kevin. The team will call you back within one business day to schedule the allergy consultation and discuss what testing might be appropriate." },
        ],
      },
      {
        patient: 'Daniel Okonkwo', phone: '+16045551707', reason: 'Diabetes management — quarterly check',
        daysAgo: 6, hour: 13, duration: 245, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Hello, Northgate Family Health. Aria speaking." },
          { role: 'user',      msg: "I'm due for my quarterly diabetes check. Need to book an appointment." },
          { role: 'assistant', msg: "Of course. Name and phone number please?" },
          { role: 'user',      msg: "Daniel Okonkwo. 604-555-1707." },
          { role: 'assistant', msg: "Daniel, I have Wednesday at 10:00 AM available. Does that work?" },
          { role: 'user',      msg: "Wednesday at 10, yes." },
          { role: 'assistant', msg: "You're booked for Wednesday at 10 AM — quarterly diabetes management check. See you then." },
        ],
      },
      {
        patient: 'Emily Davis',   phone: '+16045551808', reason: 'Sports physical — high school',
        daysAgo: 7, hour: 15, duration: 189, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Northgate Family Health, this is Aria." },
          { role: 'user',      msg: "My daughter needs a sports physical for school. She's 16." },
          { role: 'assistant', msg: "We can definitely handle that. Name and number?" },
          { role: 'user',      msg: "Emily Davis. 604-555-1808." },
          { role: 'assistant', msg: "Emily, I have a sports physical slot on Friday at 3 PM. Would that work for a 16-year-old?" },
          { role: 'user',      msg: "Yes, Friday at 3 works." },
          { role: 'assistant', msg: "Booked — sports physical Friday at 3 PM. Please bring any forms from the school." },
        ],
      },
    ],
    appointments: [
      { patient: 'Tyler Johnson',    reason: 'Well-child visit (4 yrs)',   daysAhead: 3, hour: 9,  min: 0  },
      { patient: 'Rachel Lee',       reason: 'First prenatal visit',        daysAhead: 5, hour: 11, min: 0  },
      { patient: 'Michael Brown',    reason: 'Blood pressure follow-up',    daysAhead: 7, hour: 14, min: 30 },
      { patient: 'Daniel Okonkwo',   reason: 'Diabetes quarterly check',    daysAhead: 2, hour: 10, min: 0  },
      { patient: 'Emily Davis',      reason: 'Sports physical',             daysAhead: 4, hour: 15, min: 0  },
    ],
  },

  'sunrise-dental': {
    sessions: [
      {
        patient: 'Jennifer Walsh',   phone: '+16045552101', reason: 'Routine cleaning and check-up',
        daysAgo: 1, hour: 9,  duration: 223, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental, Aria speaking. How can I help you today?" },
          { role: 'user',      msg: "Hi, I'd like to book my routine cleaning." },
          { role: 'assistant', msg: "Of course! Happy to help. Can I get your name and a callback number?" },
          { role: 'user',      msg: "Jennifer Walsh. 604-555-2101." },
          { role: 'assistant', msg: "Thanks Jennifer. We have Thursday at 9:30 AM for a routine cleaning. Does that work?" },
          { role: 'user',      msg: "Thursday morning is perfect." },
          { role: 'assistant', msg: "Wonderful — you're booked Thursday at 9:30 AM for a cleaning and check-up." },
        ],
      },
      {
        patient: 'Thomas Nguyen',    phone: '+16045552202', reason: 'Tooth pain — upper right molar',
        daysAgo: 1, hour: 11, duration: 278, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental. Aria here. How can I help?" },
          { role: 'user',      msg: "I'm having really bad pain in my upper right molar. It started yesterday." },
          { role: 'assistant', msg: "I'm sorry to hear that. Tooth pain should be seen promptly. Can I get your name and number?" },
          { role: 'user',      msg: "Thomas Nguyen. 604-555-2202." },
          { role: 'assistant', msg: "Thomas, we have an urgent slot this afternoon at 2 PM. Can you make it in?" },
          { role: 'user',      msg: "Yes, I can be there." },
          { role: 'assistant', msg: "You're booked for today at 2 PM. If the pain becomes severe before then, please let us know." },
        ],
      },
      {
        patient: 'Aaron Mitchell',   phone: '+16045552303', reason: 'Dental emergency — crown fell out',
        daysAgo: 2, hour: 8,  duration: 134, booked: true,  emergency: true, type: 'returning',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental, Aria speaking. How can I help?" },
          { role: 'user',      msg: "My crown just fell out while I was eating. I don't know what to do." },
          { role: 'assistant', msg: "Don't worry — this happens and we can help. Please keep the crown safe if you have it. You may feel sensitivity to hot and cold. Can I get your name and number?" },
          { role: 'user',      msg: "Aaron Mitchell. 604-555-2303." },
          { role: 'assistant', msg: "Aaron, I'm booking you as an emergency — we have a slot in 45 minutes. Can you come in?" },
          { role: 'user',      msg: "Yes, I'm on my way." },
        ],
      },
      {
        patient: 'Olivia Martinez',  phone: '+16045552404', reason: 'Crown replacement consultation',
        daysAgo: 3, hour: 14, duration: 312, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Hello, Sunrise Dental. Aria here." },
          { role: 'user',      msg: "I need to replace a crown. It's been cracked for a while." },
          { role: 'assistant', msg: "Of course. I can get you in for a consultation. Your name and number?" },
          { role: 'user',      msg: "Olivia Martinez. 604-555-2404." },
          { role: 'assistant', msg: "Olivia, the earliest consultation is Tuesday at 11 AM. Does that work?" },
          { role: 'user',      msg: "Tuesday at 11, yes." },
          { role: 'assistant', msg: "Booked Tuesday at 11 AM for crown consultation. The dentist will review and discuss your options." },
        ],
      },
      {
        patient: 'Brian Foster',     phone: '+16045552505', reason: 'Wisdom tooth removal — consultation',
        daysAgo: 4, hour: 9,  duration: 298, booked: true,  type: 'new',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental. This is Aria." },
          { role: 'user',      msg: "My wisdom teeth are really bothering me. I think I need them out." },
          { role: 'assistant', msg: "I understand — that can be really uncomfortable. Let me schedule a consultation. Name and number?" },
          { role: 'user',      msg: "Brian Foster. 604-555-2505." },
          { role: 'assistant', msg: "Brian, I have a wisdom tooth consultation slot Wednesday at 10 AM. How does that sound?" },
          { role: 'user',      msg: "Wednesday at 10 works great." },
          { role: 'assistant', msg: "You're booked Wednesday at 10 AM. The dentist will review your X-rays and discuss options." },
        ],
      },
      {
        patient: 'Hannah Kim',       phone: '+16045552606', reason: 'Teeth whitening inquiry',
        daysAgo: 5, hour: 13, duration: 167, booked: false, type: 'new',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental, Aria speaking." },
          { role: 'user',      msg: "I'm interested in teeth whitening. Can you tell me what options you have?" },
          { role: 'assistant', msg: "Absolutely. We offer both in-office and take-home whitening. I can schedule a brief consult where the dentist explains the options. Your name and number?" },
          { role: 'user',      msg: "Hannah Kim. 604-555-2606." },
          { role: 'assistant', msg: "Thanks Hannah. I've logged your interest. The team will call you back with pricing and availability." },
        ],
      },
      {
        patient: 'Christopher Lee',  phone: '+16045552707', reason: 'Annual X-rays and exam',
        daysAgo: 6, hour: 10, duration: 201, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental. How can I help today?" },
          { role: 'user',      msg: "I'm overdue for my annual X-rays." },
          { role: 'assistant', msg: "No worries — let's get you scheduled. Name and number?" },
          { role: 'user',      msg: "Christopher Lee. 604-555-2707." },
          { role: 'assistant', msg: "Christopher, I have Friday at 10 AM for your annual X-rays and exam. Does that work?" },
          { role: 'user',      msg: "Friday at 10, yes." },
          { role: 'assistant', msg: "Booked Friday at 10 AM for annual X-rays and exam." },
        ],
      },
      {
        patient: 'Grace Thompson',   phone: '+16045552808', reason: 'Root canal follow-up',
        daysAgo: 7, hour: 15, duration: 188, booked: true,  type: 'returning',
        turns: [
          { role: 'assistant', msg: "Sunrise Dental. Aria here. How can I help?" },
          { role: 'user',      msg: "I had a root canal last month and I need my follow-up." },
          { role: 'assistant', msg: "Of course. Let me look at availability. Name and number?" },
          { role: 'user',      msg: "Grace Thompson. 604-555-2808." },
          { role: 'assistant', msg: "Grace, we have Monday at 3:30 PM for your post-root-canal check. Can you make that?" },
          { role: 'user',      msg: "Monday at 3:30 works." },
          { role: 'assistant', msg: "Perfect. Booked Monday at 3:30 PM for your root canal follow-up." },
        ],
      },
    ],
    appointments: [
      { patient: 'Jennifer Walsh',   reason: 'Routine cleaning',           daysAhead: 3, hour: 9,  min: 30 },
      { patient: 'Olivia Martinez',  reason: 'Crown replacement consult',  daysAhead: 5, hour: 11, min: 0  },
      { patient: 'Brian Foster',     reason: 'Wisdom tooth consult',       daysAhead: 2, hour: 10, min: 0  },
      { patient: 'Christopher Lee',  reason: 'Annual X-rays and exam',     daysAhead: 4, hour: 10, min: 0  },
      { patient: 'Grace Thompson',   reason: 'Root canal follow-up',       daysAhead: 7, hour: 15, min: 30 },
    ],
  },
};

// ─── Prepared statements ─────────────────────────────────────────────────────

const stmts = {
  clearSessions:    db.prepare(`DELETE FROM sessions WHERE client_id = ?`),
  clearLeads:       db.prepare(`DELETE FROM leads WHERE client_id = ?`),
  clearAppts:       db.prepare(`DELETE FROM appointments WHERE tenant_id = ?`),
  clearEmergency:   db.prepare(`DELETE FROM emergency_events WHERE session_id IN (SELECT session_id FROM sessions WHERE client_id = ?)`),
  clearTurns:       db.prepare(`DELETE FROM conversation_turns WHERE session_id IN (SELECT session_id FROM sessions WHERE client_id = ?)`),

  insertSession: db.prepare(`
    INSERT INTO sessions
      (session_id, client_id, start_time, end_time, duration_seconds, total_turns,
       final_state, intent_detected, lead_captured, emergency_detected, channel, phone_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'phone', ?)
  `),

  insertTurn: db.prepare(`
    INSERT INTO conversation_turns (session_id, turn_number, timestamp, role, message)
    VALUES (?, ?, ?, ?, ?)
  `),

  insertLead: db.prepare(`
    INSERT INTO leads
      (session_id, client_id, name, phone, patient_type, reason_for_visit,
       completeness_score, captured_at, urgency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  insertAppt: db.prepare(`
    INSERT INTO appointments
      (appointment_id, tenant_id, session_id, start_time, end_time, patient_name, reason, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `),

  insertEmergency: db.prepare(`
    INSERT INTO emergency_events
      (session_id, timestamp, pattern_matched, user_message, response_sent)
    VALUES (?, ?, ?, ?, ?)
  `),
};

// ─── Seed ────────────────────────────────────────────────────────────────────

const seed = db.transaction(() => {
  let totalSessions = 0;
  let totalLeads = 0;
  let totalAppts = 0;
  let totalEmergencies = 0;

  for (const clinicId of CLINICS) {
    const data = DATA[clinicId];

    // Clear existing demo data for this clinic
    stmts.clearEmergency.run(clinicId);
    stmts.clearTurns.run(clinicId);
    stmts.clearLeads.run(clinicId);
    stmts.clearAppts.run(clinicId);
    stmts.clearSessions.run(clinicId);

    // Track session IDs for appointments
    const sessionIds = [];

    for (let i = 0; i < data.sessions.length; i++) {
      const s = data.sessions[i];
      const sessionId = `demo-${clinicId}-${randomUUID().slice(0, 8)}`;
      const startIso = ago(s.daysAgo, s.hour, 0);
      const endIso = endTime(startIso, s.duration);
      const turnCount = s.turns.length;
      const isBooked = s.booked ? 1 : 0;
      const isEmergency = s.emergency ? 1 : 0;
      const intent = s.emergency ? 'emergency' : (s.booked ? 'appointment_booking' : 'inquiry');

      stmts.insertSession.run(
        sessionId, clinicId, startIso, endIso, s.duration,
        turnCount, 'ended', intent, isBooked, isEmergency, s.phone,
      );

      // Conversation turns
      s.turns.forEach((t, idx) => {
        const ts = new Date(new Date(startIso).getTime() + idx * 18000).toISOString();
        stmts.insertTurn.run(sessionId, idx + 1, ts, t.role, t.msg);
      });

      // Lead (for non-emergency sessions with a patient name)
      if (!s.emergency) {
        const score = s.booked ? 1.0 : (Math.random() > 0.5 ? 0.6 : 0.4);
        const urgency = s.reason.toLowerCase().includes('pain') ? 'high' : 'normal';
        stmts.insertLead.run(
          sessionId, clinicId, s.patient, s.phone,
          s.type || 'new', s.reason, score, startIso, urgency,
        );
        totalLeads++;
      }

      // Emergency event
      if (s.emergency) {
        const emergencyTurn = s.turns.find(t => t.role === 'user' && (
          t.msg.toLowerCase().includes('pain') ||
          t.msg.toLowerCase().includes('emergency') ||
          t.msg.toLowerCase().includes('barely') ||
          t.msg.toLowerCase().includes('fell out')
        ));
        const keyword = s.reason.includes('chest') ? 'chest pain'
          : s.reason.includes('abdominal') ? 'severe abdominal pain'
          : 'dental emergency';
        stmts.insertEmergency.run(
          sessionId,
          new Date(new Date(startIso).getTime() + 25000).toISOString(),
          keyword,
          emergencyTurn?.msg ?? s.reason,
          "I'm very concerned — this sounds like a medical emergency. Please call 911 immediately.",
        );
        totalEmergencies++;
      }

      sessionIds.push({ sessionId, patient: s.patient });
      totalSessions++;
    }

    // Appointments (may fail FK if tenants not seeded — catch gracefully)
    for (const a of data.appointments) {
      const apptId = `demo-appt-${randomUUID().slice(0, 8)}`;
      const matchSession = sessionIds.find(s => s.patient === a.patient);
      const start = future(a.daysAhead, a.hour, a.min);
      const end = endTime(start, 1800); // 30-min slots
      try {
        stmts.insertAppt.run(
          apptId, clinicId, matchSession?.sessionId ?? null,
          start, end, a.patient, a.reason,
        );
        totalAppts++;
      } catch (e) {
        if (e.message?.includes('FOREIGN KEY')) {
          console.warn(`  [!] Skipping appointments for ${clinicId} — run the server once first to seed tenants.`);
          break;
        }
        throw e;
      }
    }

    console.log(`  ✓ ${clinicId}: ${data.sessions.length} sessions`);
  }

  console.log(`\nSeeded: ${totalSessions} sessions · ${totalLeads} leads · ${totalAppts} appointments · ${totalEmergencies} emergency events`);
});

console.log('\n[seed-demo] Seeding demo data for 3 clinics…\n');
seed();
console.log('[seed-demo] Done.\n');
