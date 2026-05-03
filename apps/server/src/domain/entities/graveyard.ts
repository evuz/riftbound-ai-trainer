import { Card } from './card';

export class Graveyard {
  private cards: Card[];

  constructor() {
    this.cards = [];
  }

  add(card: Card): void {
    this.cards.push(card);
  }

  addAll(cards: Card[]): void {
    this.cards.push(...cards);
  }

  removeById(id: string): Card | undefined {
    const index = this.cards.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    const [card] = this.cards.splice(index, 1);
    return card;
  }

  getCards(): Card[] { return [...this.cards]; }
  size(): number { return this.cards.length; }

  getAllAndClear(): Card[] {
    const all = [...this.cards];
    this.cards = [];
    return all;
  }
}