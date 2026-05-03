import { Card } from './card';

export class Deck {
  private cards: Card[];

  constructor(cards: Card[]) {
    this.cards = [...cards];
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card | undefined {
    return this.cards.pop();
  }

  drawMultiple(count: number): Card[] {
    const drawn: Card[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.draw();
      if (card) drawn.push(card);
    }
    return drawn;
  }

  peekTop(count: number): Card[] {
    return this.cards.slice(-count).reverse();
  }

  putOnBottom(card: Card): void {
    this.cards.unshift(card);
  }

  putOnBottomMultiple(cards: Card[]): void {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    this.cards = [...shuffled, ...this.cards];
  }

  remaining(): number { return this.cards.length; }
  isEmpty(): boolean { return this.cards.length === 0; }
}