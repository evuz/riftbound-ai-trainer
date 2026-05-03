import { Card } from './card';
import { Deck } from './deck';
import { Hand } from './hand';
import { Graveyard } from './graveyard';
import { Banishment } from './banishment';
import { ChanneledRune } from './channeled-rune';
import { RunePool } from '../value-objects/rune-pool';
import { VictoryPoints } from '../value-objects/victory-points';
import { Xp } from '../value-objects/xp';
import { Cost } from '../value-objects/cost';
import { Energy } from '../value-objects/energy';
import { Power } from '../value-objects/power';
import { PlayerId } from '../enums/player';

export class Player {
  public readonly id: PlayerId;
  public readonly legend: Card;
  private championZone: Card | null;
  private hand: Hand;
  private deck: Deck;
  private runeDeck: Deck;
  private channeledRunes: ChanneledRune[];
  private graveyard: Graveyard;
  private banishment: Banishment;
  private runePool: RunePool;
  private victoryPoints: VictoryPoints;
  private xp: Xp;

  constructor(
    id: PlayerId,
    legend: Card,
    champion: Card,
    deckCards: Card[],
    runeCards: Card[],
  ) {
    this.id = id;
    this.legend = legend;
    this.championZone = champion;
    this.deck = new Deck(deckCards);
    this.runeDeck = new Deck(runeCards);
    this.hand = new Hand();
    this.channeledRunes = [];
    this.graveyard = new Graveyard();
    this.banishment = new Banishment();
    this.runePool = RunePool.empty();
    this.victoryPoints = VictoryPoints.zero();
    this.xp = Xp.zero();
  }

  getHand(): Card[] { return this.hand.getCards(); }
  getHandSize(): number { return this.hand.size(); }
  getDeckSize(): number { return this.deck.remaining(); }
  getRuneDeckSize(): number { return this.runeDeck.remaining(); }
  getChampion(): Card | null { return this.championZone; }
  getChanneledRunes(): ChanneledRune[] { return [...this.channeledRunes]; }
  getRunePool(): RunePool { return this.runePool; }
  getVictoryPoints(): VictoryPoints { return this.victoryPoints; }
  getXp(): Xp { return this.xp; }
  getGraveyard(): Card[] { return this.graveyard.getCards(); }
  getBanishment(): Card[] { return this.banishment.getCards(); }

  shuffleDecks(): void {
    this.deck.shuffle();
    this.runeDeck.shuffle();
  }

  drawOpeningHand(): Card[] {
    const cards = this.deck.drawMultiple(4);
    this.hand.add(cards);
    return cards;
  }

  mulligan(indices: number[]): void {
    if (indices.length > 2) throw new Error('Can only mulligan up to 2 cards');
    const toRecycle = indices
      .sort((a, b) => b - a)
      .map(i => this.hand.removeByIndex(i));
    const drawn = this.deck.drawMultiple(toRecycle.length);
    this.hand.add(drawn);
    this.deck.putOnBottomMultiple(toRecycle);
  }

  drawCard(): Card | undefined {
    const card = this.deck.draw();
    if (card) this.hand.add([card]);
    return card;
  }

  drawCards(count: number): Card[] {
    const cards = this.deck.drawMultiple(count);
    this.hand.add(cards);
    return cards;
  }

  channelRune(): ChanneledRune | null {
    const rune = this.runeDeck.draw();
    if (!rune) return null;
    const channeled = new ChanneledRune(rune);
    this.channeledRunes.push(channeled);
    return channeled;
  }

  channelRunes(count: number): ChanneledRune[] {
    const runes: ChanneledRune[] = [];
    for (let i = 0; i < count; i++) {
      const rune = this.channelRune();
      if (rune) runes.push(rune);
    }
    return runes;
  }

  addEnergy(amount: Energy): void {
    this.runePool = this.runePool.addEnergy(amount);
  }

  addPower(power: Power): void {
    this.runePool = this.runePool.addPower(power);
  }

  canPay(cost: Cost): boolean {
    return this.runePool.canPay(cost);
  }

  payCost(cost: Cost): void {
    this.runePool = this.runePool.spend(cost);
  }

  emptyRunePool(): void {
    this.runePool = this.runePool.empty();
  }

  getCardFromHand(cardId: string): Card | undefined {
    return this.hand.getCards().find(c => c.id === cardId);
  }

  removeCardFromHand(cardId: string): Card | undefined {
    return this.hand.removeById(cardId);
  }

  playChampion(): Card | undefined {
    const champion = this.championZone;
    this.championZone = null;
    return champion || undefined;
  }

  discardCard(cardId: string): Card | undefined {
    const card = this.hand.removeById(cardId);
    if (card) this.graveyard.add(card);
    return card;
  }

  addPoints(amount: number): void {
    this.victoryPoints = this.victoryPoints.add(amount);
  }

  canWin(): boolean {
    return this.victoryPoints.isWinner();
  }

  addXp(amount: number): void {
    this.xp = this.xp.add(amount);
  }
}