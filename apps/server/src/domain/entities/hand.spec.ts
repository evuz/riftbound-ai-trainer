import { describe, it, expect } from 'vitest';
import { Hand } from './hand';
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

describe('Hand', () => {
  it('should add cards', () => {
    const hand = new Hand();
    hand.add([createCard('1'), createCard('2')]);
    expect(hand.size()).toBe(2);
  });

  it('should remove by index', () => {
    const hand = new Hand([createCard('1'), createCard('2'), createCard('3')]);
    const removed = hand.removeByIndex(1);
    expect(removed.id).toBe('2');
    expect(hand.size()).toBe(2);
  });

  it('should throw on invalid index', () => {
    const hand = new Hand([createCard('1')]);
    expect(() => hand.removeByIndex(5)).toThrow();
  });

  it('should remove by id', () => {
    const hand = new Hand([createCard('1'), createCard('2')]);
    const removed = hand.removeById('1');
    expect(removed?.id).toBe('1');
    expect(hand.size()).toBe(1);
  });

  it('should return undefined when removing non-existent id', () => {
    const hand = new Hand();
    expect(hand.removeById('x')).toBeUndefined();
  });

  it('should detect empty hand', () => {
    expect(new Hand().isEmpty()).toBe(true);
    expect(new Hand([createCard('1')]).isEmpty()).toBe(false);
  });

  it('should check if has card', () => {
    const hand = new Hand([createCard('1')]);
    expect(hand.hasCard('1')).toBe(true);
    expect(hand.hasCard('2')).toBe(false);
  });
});