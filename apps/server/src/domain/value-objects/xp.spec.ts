import { describe, it, expect } from 'vitest';
import { Xp } from './xp';

describe('Xp', () => {
  it('should create zero', () => {
    expect(Xp.zero().value).toBe(0);
  });

  it('should add xp', () => {
    const result = Xp.zero().add(3);
    expect(result.value).toBe(3);
  });

  it('should throw on negative value after adding', () => {
    expect(() => Xp.zero().add(-1)).toThrow();
  });
});