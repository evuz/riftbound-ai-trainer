import { describe, it, expect } from 'vitest';
import { ChanneledRune } from './channeled-rune';
import { Card, CardProps } from './card';
import { CardType } from '../enums/card-type';
import { Domain } from '../enums/domain';
import { Rarity } from '../enums/rarity';

function createRuneCard(domain: Domain): Card {
  return new Card({
    id: `rune_${domain}`,
    name: `${domain} Rune`,
    type: CardType.RUNE,
    domain: [domain],
    rarity: Rarity.COMMON,
    rulesText: '',
    keywords: [],
    tags: [],
  });
}

describe('ChanneledRune', () => {
  it('should enter ready', () => {
    const rune = new ChanneledRune(createRuneCard(Domain.FURY));
    expect(rune.isExhausted()).toBe(false);
  });

  it('should exhaust', () => {
    const rune = new ChanneledRune(createRuneCard(Domain.FURY));
    rune.exhaust();
    expect(rune.isExhausted()).toBe(true);
  });

  it('should ready', () => {
    const rune = new ChanneledRune(createRuneCard(Domain.FURY));
    rune.exhaust();
    rune.ready();
    expect(rune.isExhausted()).toBe(false);
  });

  it('should have a unique instanceId', () => {
    const rune1 = new ChanneledRune(createRuneCard(Domain.FURY));
    const rune2 = new ChanneledRune(createRuneCard(Domain.FURY));
    expect(rune1.instanceId).not.toBe(rune2.instanceId);
  });
});