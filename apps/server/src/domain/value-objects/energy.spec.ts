import { describe, it, expect } from 'vitest';
import { Energy } from './energy';

describe('Energy', () => {
  it('should create from a valid value', () => {
    const energy = Energy.of(5);
    expect(energy.value).toBe(5);
  });

  it('should create zero', () => {
    expect(Energy.zero().value).toBe(0);
  });

  it('should throw on negative value', () => {
    expect(() => Energy.of(-1)).toThrow();
  });

  it('should throw on non-integer value', () => {
    expect(() => Energy.of(3.5)).toThrow();
  });

  it('should add two energies', () => {
    const result = Energy.of(3).add(Energy.of(2));
    expect(result.value).toBe(5);
  });

  it('should subtract two energies', () => {
    const result = Energy.of(5).subtract(Energy.of(3));
    expect(result.value).toBe(2);
  });

  it('should not go below zero on subtract', () => {
    const result = Energy.of(2).subtract(Energy.of(5));
    expect(result.value).toBe(0);
  });

  it('should detect zero', () => {
    expect(Energy.zero().isZero()).toBe(true);
    expect(Energy.of(1).isZero()).toBe(false);
  });
});