import { describe, it, expect } from 'vitest';
import { RunePool } from './rune-pool';
import { Energy } from './energy';
import { Power } from './power';
import { Cost } from './cost';

describe('RunePool', () => {
  it('should create empty pool', () => {
    const pool = RunePool.empty();
    expect(pool.energy.value).toBe(0);
  });

  it('should add energy', () => {
    const pool = RunePool.empty().addEnergy(Energy.of(3));
    expect(pool.energy.value).toBe(3);
  });

  it('should add domain power', () => {
    const pool = RunePool.empty().addPower(Power.fury());
    expect(pool.power.get('fury')).toBe(1);
  });

  it('should add any power as colorless', () => {
    const pool = RunePool.empty().addPower(Power.any());
    expect(pool.power.get('colorless')).toBe(1);
  });

  it('should detect payable cost', () => {
    const pool = RunePool.empty()
      .addEnergy(Energy.of(3))
      .addPower(Power.fury());
    const cost = Cost.of(2, [Power.fury()]);
    expect(pool.canPay(cost)).toBe(true);
  });

  it('should detect unpayable cost due to energy', () => {
    const pool = RunePool.empty().addEnergy(Energy.of(1));
    const cost = Cost.of(3, []);
    expect(pool.canPay(cost)).toBe(false);
  });

  it('should detect unpayable cost due to power', () => {
    const pool = RunePool.empty().addEnergy(Energy.of(5));
    const cost = Cost.of(1, [Power.fury(), Power.fury()]);
    expect(pool.canPay(cost)).toBe(false);
  });

  it('should pay cost and consume resources', () => {
    const pool = RunePool.empty()
      .addEnergy(Energy.of(5))
      .addPower(Power.fury())
      .addPower(Power.fury());
    const cost = Cost.of(2, [Power.fury()]);
    const result = pool.spend(cost);
    expect(result.energy.value).toBe(3);
    expect(result.power.get('fury')).toBe(1);
  });

  it('should throw when spending unpayable cost', () => {
    const pool = RunePool.empty();
    const cost = Cost.of(1, [Power.fury()]);
    expect(() => pool.spend(cost)).toThrow();
  });

  it('should empty all resources', () => {
    const pool = RunePool.empty()
      .addEnergy(Energy.of(10))
      .addPower(Power.fury())
      .addPower(Power.calm());
    const emptied = pool.empty();
    expect(emptied.energy.value).toBe(0);
    expect(emptied.power.get('fury')).toBe(0);
    expect(emptied.power.get('calm')).toBe(0);
  });

  it('should use any power to pay domain power cost', () => {
    const pool = RunePool.empty()
      .addEnergy(Energy.of(3))
      .addPower(Power.any())
      .addPower(Power.any());
    const cost = Cost.of(1, [Power.fury(), Power.calm()]);
    expect(pool.canPay(cost)).toBe(true);
  });
});