import { it, expect, describe } from 'vitest';
import { EmergencyDetector } from '../js/modules/emergency-detector.js';

describe('EmergencyDetector', () => {
  const detector = new EmergencyDetector();

  const crisisTests = [
    { category: 'cardiac', input: 'I am having chest pain' },
    { category: 'respiratory', input: 'I can\'t breathe' },
    { category: 'neurological', input: 'I think I am having a stroke' },
    { category: 'trauma', input: 'there is severe bleeding here' },
    { category: 'pediatric', input: 'my baby is not breathing' },
    { category: 'direct', input: 'call 911 now' },
    { category: 'unconscious', input: 'he just passed out' },
    { category: 'respiratory', input: 'I am choking help' }
  ];

  crisisTests.forEach(({ category, input }) => {
    it(`should detect ${category} emergency: "${input}"`, () => {
      const result = detector.scan(input);
      expect(result.detected).toBe(true);
      expect(result.response).toContain('911');
      
      // Rule 3: No booking language
      const banned = ['appointment', 'schedule', 'book', 'follow-up'];
      banned.forEach(word => {
        expect(result.response.toLowerCase()).not.toContain(word);
      });
    });
  });

  it('should not detect emergency for normal symptoms', () => {
    const result = detector.scan('I have a mild headache and a cough');
    expect(result.detected).toBe(false);
  });
});
