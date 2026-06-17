import { it, expect, describe, beforeEach, vi } from 'vitest';
import { LeadCapture } from '../js/modules/lead-capture.js';

// Manual override for browser mode compatibility
import { AppContext } from '../js/config/loader.js';
AppContext.getConfig = () => ({ company_name: 'Test Clinic' });

describe('LeadCapture', () => {
  let lc;

  beforeEach(() => {
    lc = new LeadCapture();
    localStorage.clear();
  });

  it('should capture medical fields correctly', () => {
    lc.capture('name', 'John Doe');
    lc.capture('dob', '1985-05-12');
    lc.capture('reason_for_visit', 'Routine checkup');
    
    const data = lc.getData();
    expect(data.name).toBe('John Doe');
    expect(data.dob).toBe('1985-05-12');
    expect(data.reason_for_visit).toBe('Routine checkup');
  });

  it('should calculate completeness correctly', () => {
    // Weights: name 25, reason 25, patient_type 15, phone 15, dob 10, insurance 10
    lc.capture('name', 'John Doe');
    expect(lc.getCompleteness()).toBe(25);

    lc.capture('reason_for_visit', 'Flu symptoms');
    expect(lc.getCompleteness()).toBe(50);

    lc.capture('phone', '6125551234');
    expect(lc.getCompleteness()).toBe(65);
  });

  it('should reset behavior', () => {
    lc.capture('name', 'John Doe');
    lc.reset();
    expect(lc.getData().name).toBe(null);
    expect(lc.getCompleteness()).toBe(0);
  });

  it('should verify minimum data requirement', () => {
    lc.capture('name', 'John Doe');
    expect(lc.hasMinimumData()).toBe(false);
    
    lc.capture('reason_for_visit', 'Back pain');
    expect(lc.hasMinimumData()).toBe(true);
  });
});
