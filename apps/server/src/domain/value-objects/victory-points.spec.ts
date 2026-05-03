import { describe, it, expect } from 'vitest';
import { VictoryPoints } from './victory-points';

describe('VictoryPoints', () => {
  it('should create zero', () => {
    expect(VictoryPoints.zero().value).toBe(0);
  });

  it('should add points', () => {
    const result = VictoryPoints.of(3).add(2);
    expect(result.value).toBe(5);
  });

  it('should cap at 8', () => {
    const result = VictoryPoints.of(7).add(2);
    expect(result.value).toBe(8);
  });

  it('should throw on negative value', () => {
    expect(() => VictoryPoints.of(-1)).toThrow();
  });

  it('should throw on value above 8', () => {
    expect(() => VictoryPoints.of(9)).toThrow();
  });

  it('should detect winner at 8 points', () => {
    expect(VictoryPoints.of(8).isWinner()).toBe(true);
  });

  it('should not detect winner below 8 points', () => {
    expect(VictoryPoints.of(7).isWinner()).toBe(false);
  });
});