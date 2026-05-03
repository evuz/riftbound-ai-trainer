import { describe, it, expect } from 'vitest';
import { Card, CardProps } from './card';
import { CardType } from '../enums/card-type';
import { Domain } from '../enums/domain';
import { Rarity } from '../enums/rarity';

const baseProps: CardProps = {
  id: 'ogn-001',
  name: 'Test Unit',
  type: CardType.UNIT,
  domain: [Domain.FURY],
  rarity: Rarity.COMMON,
  rulesText: 'Test rules',
  keywords: [],
  tags: [],
  energyCost: 3,
  powerCost: 1,
  might: 4,
};

describe('Card', () => {
  it('should create a unit card', () => {
    const card = new Card(baseProps);
    expect(card.id).toBe('ogn-001');
    expect(card.type).toBe(CardType.UNIT);
    expect(card.might?.value).toBe(4);
  });

  it('should create a spell card without might', () => {
    const card = new Card({ ...baseProps, type: CardType.SPELL, might: undefined });
    expect(card.type).toBe(CardType.SPELL);
    expect(card.might).toBeUndefined();
  });

  it('should get energy cost', () => {
    const card = new Card(baseProps);
    expect(card.getEnergyCost()).toBe(3);
  });

  it('should get power cost', () => {
    const card = new Card(baseProps);
    expect(card.getPowerCost()).toBe(1);
  });

  it('should default energy cost to 0', () => {
    const card = new Card({ ...baseProps, energyCost: undefined });
    expect(card.getEnergyCost()).toBe(0);
  });

  it('should detect champion unit', () => {
    const card = new Card({ ...baseProps, isChampion: true });
    expect(card.isChampion).toBe(true);
  });

  it('should detect signature card', () => {
    const card = new Card({ ...baseProps, isSignature: true });
    expect(card.isSignature).toBe(true);
  });

  it('should have mightBonus for gear', () => {
    const card = new Card({
      ...baseProps,
      type: CardType.GEAR,
      might: undefined,
      mightBonus: 2,
    });
    expect(card.mightBonus).toBe(2);
  });
});