import { Card } from './card';

export class ChanneledRune {
  public readonly instanceId: string;
  private card: Card;
  private exhausted: boolean;

  constructor(card: Card) {
    this.card = card;
    this.instanceId = `${card.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.exhausted = false;
  }

  getCard(): Card { return this.card; }
  isExhausted(): boolean { return this.exhausted; }

  exhaust(): void { this.exhausted = true; }
  ready(): void { this.exhausted = false; }
}