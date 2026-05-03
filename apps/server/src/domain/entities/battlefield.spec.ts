import { describe, it, expect } from 'vitest';
import { Battlefield } from './battlefield';
import { Card, CardProps } from './card';
import { UnitOnBoard } from './unit-on-board';
import { CardType } from '../enums/card-type';
import { Domain } from '../enums/domain';
import { Rarity } from '../enums/rarity';
import { BattlefieldControlState } from '../enums/battlefield-control-state';
import { PlayerId } from '../enums/player';

function createBattlefieldCard(): Card {
  return new Card({
    id: 'bf_001',
    name: 'Test Battlefield',
    type: CardType.BATTLEFIELD,
    domain: [Domain.COLORLESS],
    rarity: Rarity.UNCOMMON,
    rulesText: '',
    keywords: [],
    tags: [],
    orientation: 'landscape',
  });
}

function createUnitCard(): Card {
  return new Card({
    id: 'u_001',
    name: 'Test Unit',
    type: CardType.UNIT,
    domain: [Domain.FURY],
    rarity: Rarity.COMMON,
    rulesText: '',
    keywords: [],
    tags: [],
    might: 3,
  });
}

describe('Battlefield', () => {
  it('should start open', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    expect(bf.getState()).toBe(BattlefieldControlState.OPEN);
    expect(bf.getController()).toBeNull();
  });

  it('should add and remove units', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    const unit = new UnitOnBoard(createUnitCard());
    bf.addUnit(unit);
    expect(bf.getUnits()).toHaveLength(1);
    bf.removeUnit(unit.instanceId);
    expect(bf.getUnits()).toHaveLength(0);
  });

  it('should mark as contested', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    bf.markContested();
    expect(bf.getState()).toBe(BattlefieldControlState.CONTESTED);
  });

  it('should mark as controlled', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    bf.markControlled(PlayerId.HUMAN);
    expect(bf.getState()).toBe(BattlefieldControlState.CONTROLLED);
    expect(bf.getController()).toBe(PlayerId.HUMAN);
  });

  it('should allow scoring only once per turn', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    bf.markControlled(PlayerId.HUMAN);
    expect(bf.canScore(PlayerId.HUMAN)).toBe(true);
    bf.markScored(PlayerId.HUMAN);
    expect(bf.canScore(PlayerId.HUMAN)).toBe(false);
  });

  it('should reset scored on new turn', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    bf.markControlled(PlayerId.HUMAN);
    bf.markScored(PlayerId.HUMAN);
    bf.resetScored();
    expect(bf.canScore(PlayerId.HUMAN)).toBe(true);
  });

  it('should not allow scoring if not controlled', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    expect(bf.canScore(PlayerId.HUMAN)).toBe(false);
  });

  it('should hide and reveal facedown cards', () => {
    const bf = new Battlefield(0, createBattlefieldCard());
    const card = createUnitCard();
    bf.hideCard(card);
    expect(bf.getFacedown()).toBe(card);
    bf.removeFacedown();
    expect(bf.getFacedown()).toBeNull();
  });
});