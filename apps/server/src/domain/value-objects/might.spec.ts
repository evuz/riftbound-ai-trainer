import { describe, it, expect } from 'vitest';
import { Might } from './might';

describe('Might', () => {
  it('should create from valid value', () => {
    expect(Might.of(5).value).toBe(5);
  });

  it('should throw on negative value', () => {
    expect(() => Might.of(-1)).toThrow();
  });

  it('should throw on non-integer value', () => {
    expect(() => Might.of(2.5)).toThrow();
  });
});