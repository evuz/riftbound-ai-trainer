import { describe, it, expect } from 'vitest';
import { Cost } from './cost';
import { Power } from './power';

describe('Cost', () => {
  it('should create zero cost', () => {
    const cost = Cost.zero();
    expect(cost.energy.value).toBe(0);
    expect(cost.powers).toHaveLength(0);
  });

  it('should create cost with energy and powers', () => {
    const cost = Cost.of(3, [Power.fury(), Power.calm()]);
    expect(cost.energy.value).toBe(3);
    expect(cost.powers).toHaveLength(2);
  });
});