import { describe, it, expect } from 'vitest';
import { Power } from './power';

describe('Power', () => {
  it('should create fury power', () => {
    expect(Power.fury().domain).toBe('fury');
  });

  it('should create any power with null domain', () => {
    expect(Power.any().domain).toBeNull();
  });

  it('any power equals any other power', () => {
    expect(Power.any().equals(Power.fury())).toBe(true);
  });

  it('same domain powers are equal', () => {
    expect(Power.fury().equals(Power.fury())).toBe(true);
  });

  it('different domain powers are not equal', () => {
    expect(Power.fury().equals(Power.calm())).toBe(false);
  });
});