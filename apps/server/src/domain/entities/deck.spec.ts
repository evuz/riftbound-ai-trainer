import { describe, it, expect } from 'vitest';
import { Deck } from './deck';
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

describe('Deck', () => {
  it('should draw the top card', () => {
    const cards = [createCard('1'), createCard('2'), createCard('3')];
    const deck = new Deck(cards);
    const drawn = deck.draw();
    expect(drawn?.id).toBe('3');
    expect(deck.remaining()).toBe(2);
  });

  it('should draw multiple cards', () => {
    const cards = [createCard('1'), createCard('2'), createCard('3'), createCard('4'), createCard('5')];
    const deck = new Deck(cards);
    const drawn = deck.drawMultiple(3);
    expect(drawn).toHaveLength(3);
    expect(drawn[0].id).toBe('5');
    expect(drawn[1].id).toBe('4');
    expect(drawn[2].id).toBe('3');
    expect(deck.remaining()).toBe(2);
  });

  it('should draw fewer if deck runs out', () => {
    const cards = [createCard('1'), createCard('2')];
    const deck = new Deck(cards);
    const drawn = deck.drawMultiple(5);
    expect(drawn).toHaveLength(2);
    expect(deck.isEmpty()).toBe(true);
  });

  it('should return undefined when drawing from empty deck', () => {
    const deck = new Deck([]);
    expect(deck.draw()).toBeUndefined();
  });

  it('should put a card on the bottom', () => {
    const deck = new Deck([createCard('1'), createCard('2')]);
    deck.putOnBottom(createCard('3'));
    deck.draw();
    deck.draw();
    const bottom = deck.draw();
    expect(bottom?.id).toBe('3');
  });

  it('should shuffle', () => {
    const cards = Array.from({ length: 40 }, (_, i) => createCard(`${i}`));
    const deck = new Deck(cards);
    deck.shuffle();
    expect(deck.remaining()).toBe(40);
  });

  it('should peek top cards without removing them', () => {
    const cards = [createCard('1'), createCard('2'), createCard('3')];
    const deck = new Deck(cards);
    const peeked = deck.peekTop(2);
    expect(peeked).toHaveLength(2);
    expect(peeked[0].id).toBe('3');
    expect(deck.remaining()).toBe(3);
  });
});