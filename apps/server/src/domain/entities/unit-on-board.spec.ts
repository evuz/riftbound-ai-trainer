import { describe, it, expect } from 'vitest';
import { UnitOnBoard } from './unit-on-board';
import { Card, CardProps } from './card';
import { CardType } from '../enums/card-type';
import { Domain } from '../enums/domain';
import { Rarity } from '../enums/rarity';
import { CombatDesignation } from '../enums/combat-designation';

function createUnitCard(might: number): Card {
  return new Card({
    id: 'test_unit',
    name: 'Test Unit',
    type: CardType.UNIT,
    domain: [Domain.FURY],
    rarity: Rarity.COMMON,
    rulesText: '',
    keywords: [],
    tags: [],
    might,
  });
}

function createGearCard(mightBonus: number): Card {
  return new Card({
    id: 'test_gear',
    name: 'Test Gear',
    type: CardType.GEAR,
    domain: [Domain.FURY],
    rarity: Rarity.COMMON,
    rulesText: '',
    keywords: [],
    tags: [],
    mightBonus,
  });
}

describe('UnitOnBoard', () => {
  it('should enter exhausted by default', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    expect(unit.isExhausted()).toBe(true);
  });

  it('should ready and exhaust', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.ready();
    expect(unit.isExhausted()).toBe(false);
    unit.exhaust();
    expect(unit.isExhausted()).toBe(true);
  });

  it('should return its base might', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    expect(unit.currentMight()).toBe(4);
  });

  it('should take damage', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.takeDamage(2);
    expect(unit.isAlive()).toBe(true);
    unit.takeDamage(3);
    expect(unit.isAlive()).toBe(false);
  });

  it('should heal damage', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.takeDamage(3);
    unit.heal(2);
    expect(unit.isAlive()).toBe(true);
  });

  it('should buff', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.buff();
    expect(unit.hasBuff()).toBe(true);
    expect(unit.currentMight()).toBe(5);
  });

  it('should not double buff', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.buff();
    unit.buff();
    expect(unit.currentMight()).toBe(5);
  });

  it('should spend buff', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.buff();
    unit.spendBuff();
    expect(unit.hasBuff()).toBe(false);
    expect(unit.currentMight()).toBe(4);
  });

  it('should throw when spending non-existent buff', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    expect(() => unit.spendBuff()).toThrow();
  });

  it('should attach gear and increase might', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    const gear = createGearCard(2);
    unit.attachGear(gear);
    expect(unit.getAttachedGear()).toHaveLength(1);
    expect(unit.currentMight()).toBe(6);
  });

  it('should detach gear', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    const gear = createGearCard(2);
    unit.attachGear(gear);
    unit.detachGear(gear.id);
    expect(unit.getAttachedGear()).toHaveLength(0);
    expect(unit.currentMight()).toBe(4);
  });

  it('should set and clear combat designation', () => {
    const unit = new UnitOnBoard(createUnitCard(4));
    unit.setDesignation(CombatDesignation.ATTACKER);
    expect(unit.getDesignation()).toBe(CombatDesignation.ATTACKER);
    unit.clearDesignation();
    expect(unit.getDesignation()).toBeNull();
  });

  it('should have unique instanceId', () => {
    const card = createUnitCard(4);
    const unit1 = new UnitOnBoard(card);
    const unit2 = new UnitOnBoard(card);
    expect(unit1.instanceId).not.toBe(unit2.instanceId);
  });
});