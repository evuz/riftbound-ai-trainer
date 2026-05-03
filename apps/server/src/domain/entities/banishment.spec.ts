import { describe, it, expect } from 'vitest';
import { Banishment } from './banishment';
import { Card, CardProps } from './card';
import { CardType } from '../enums/card-type';
import { Domain } from '../enums/domain';
import { Rarity } from '../enums/rarity';

function createCard(id: string): Card {
  return new Card({
    id,
    name: `Card ${id}`,
    type: CardType.UNIT,
    domain: [Domain.FURY],
    rarity: Rarity.COMMON,
    rulesText: '',
    keywords: [],
    tags: [],
  });
}

describe('Banishment', () => {
  it('should add a card', () => {
    const b = new Banishment();
    b.add(createCard('1'));
    expect(b.size()).toBe(1);
  });

  it('should return cards', () => {
    const b = new Banishment();
    b.add(createCard('1'));
    expect(b.getCards()).toHaveLength(1);
  });
});