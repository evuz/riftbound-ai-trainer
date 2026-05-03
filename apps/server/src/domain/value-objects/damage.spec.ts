import { describe, it, expect } from 'vitest';
import { Damage } from './damage';
import { Might } from './might';

describe('Damage', () => {
  it('should create zero', () => {
    expect(Damage.zero().value).toBe(0);
  });

  it('should add damage', () => {
    const result = Damage.zero().add(3);
    expect(result.value).toBe(3);
  });

  it('should heal damage', () => {
    const result = Damage.of(5).heal(2);
    expect(result.value).toBe(3);
  });

  it('should not go below zero on heal', () => {
    const result = Damage.of(2).heal(5);
    expect(result.value).toBe(0);
  });

  it('should detect lethal damage', () => {
    const damage = Damage.of(4);
    const might = Might.of(3);
    expect(damage.isLethal(might)).toBe(true);
  });

  it('should detect non-lethal damage', () => {
    const damage = Damage.of(2);
    const might = Might.of(5);
    expect(damage.isLethal(might)).toBe(false);
  });

  it('should detect equal damage and might as lethal', () => {
    const damage = Damage.of(4);
    const might = Might.of(4);
    expect(damage.isLethal(might)).toBe(true);
  });
});