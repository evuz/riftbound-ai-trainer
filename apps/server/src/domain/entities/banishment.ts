import { Card } from './card';

export class Banishment {
  private cards: Card[];

  constructor() {
    this.cards = [];
  }

  add(card: Card): void {
    this.cards.push(card);
  }

  getCards(): Card[] { return [...this.cards]; }
  size(): number { return this.cards.length; }
}