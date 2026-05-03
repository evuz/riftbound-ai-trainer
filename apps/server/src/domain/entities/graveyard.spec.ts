import { describe, it, expect } from 'vitest';
import { Graveyard } from './graveyard';
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

describe('Graveyard', () => {
  it('should add a card', () => {
    const gy = new Graveyard();
    gy.add(createCard('1'));
    expect(gy.size()).toBe(1);
  });

  it('should add multiple cards', () => {
    const gy = new Graveyard();
    gy.addAll([createCard('1'), createCard('2')]);
    expect(gy.size()).toBe(2);
  });

  it('should remove by id', () => {
    const gy = new Graveyard();
    gy.add(createCard('1'));
    const removed = gy.removeById('1');
    expect(removed?.id).toBe('1');
    expect(gy.size()).toBe(0);
  });

  it('should return undefined for non-existent id', () => {
    const gy = new Graveyard();
    expect(gy.removeById('x')).toBeUndefined();
  });

  it('should get all and clear', () => {
    const gy = new Graveyard();
    gy.addAll([createCard('1'), createCard('2')]);
    const all = gy.getAllAndClear();
    expect(all).toHaveLength(2);
    expect(gy.size()).toBe(0);
  });
});