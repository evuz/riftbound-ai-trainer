import { Card } from './card';

export class Hand {
  private cards: Card[];

  constructor(cards: Card[] = []) {
    this.cards = [...cards];
  }

  add(cards: Card[]): void {
    this.cards.push(...cards);
  }

  removeByIndex(index: number): Card {
    if (index < 0 || index >= this.cards.length) {
      throw new Error(`Invalid hand index: ${index}`);
    }
    const [card] = this.cards.splice(index, 1);
    return card;
  }

  removeById(id: string): Card | undefined {
    const index = this.cards.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    return this.removeByIndex(index);
  }

  getCards(): Card[] { return [...this.cards]; }
  size(): number { return this.cards.length; }
  isEmpty(): boolean { return this.cards.length === 0; }
  hasCard(id: string): boolean { return this.cards.some(c => c.id === id); }
}