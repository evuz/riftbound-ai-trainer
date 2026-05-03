import { Card, CardProps } from '../../../domain/entities/card';
import { CardType } from '../../../domain/enums/card-type';
import { cardSchema } from '../../../domain/schemas/card.schema';
import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.resolve(__dirname, '../../../data/cartas');

export class CardLoader {
  private cards: Card[] = [];
  private loaded = false;

  async load(): Promise<void> {
    const filePath = path.join(DATA_PATH, 'ogn.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const items = Array.isArray(raw) ? raw : raw.items;
    this.cards = items.map((item: unknown) => {
      const parsed = cardSchema.parse(item);
      return new Card(parsed as CardProps);
    });
    this.loaded = true;
  }

  getAll(): Card[] {
    this.ensureLoaded();
    return [...this.cards];
  }

  getByType(type: CardType): Card[] {
    return this.getAll().filter(c => c.type === type);
  }

  getUnits(): Card[] { return this.getByType(CardType.UNIT); }
  getGear(): Card[] { return this.getByType(CardType.GEAR); }
  getSpells(): Card[] { return this.getByType(CardType.SPELL); }
  getBattlefields(): Card[] { return this.getByType(CardType.BATTLEFIELD); }
  getLegends(): Card[] { return this.getByType(CardType.LEGEND); }
  getRunes(): Card[] { return this.getByType(CardType.RUNE); }

  getCardById(id: string): Card | undefined {
    return this.getAll().find(c => c.id === id);
  }

  private ensureLoaded(): void {
    if (!this.loaded) throw new Error('CardLoader not loaded. Call load() first.');
  }
}