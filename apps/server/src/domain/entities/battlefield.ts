import { Card } from './card';
import { UnitOnBoard } from './unit-on-board';
import { BattlefieldControlState } from '../enums/battlefield-control-state';
import { PlayerId } from '../enums/player';

export class Battlefield {
  public readonly id: number;
  public readonly card: Card;
  private state: BattlefieldControlState;
  private controller: PlayerId | null;
  private scoredThisTurn: Set<PlayerId>;
  private units: UnitOnBoard[];
  private facedownCard: Card | null;

  constructor(id: number, card: Card) {
    this.id = id;
    this.card = card;
    this.state = BattlefieldControlState.OPEN;
    this.controller = null;
    this.scoredThisTurn = new Set();
    this.units = [];
    this.facedownCard = null;
  }

  getState(): BattlefieldControlState { return this.state; }
  getController(): PlayerId | null { return this.controller; }
  getUnits(): UnitOnBoard[] { return [...this.units]; }
  getFacedown(): Card | null { return this.facedownCard; }

  addUnit(unit: UnitOnBoard): void {
    this.units.push(unit);
  }

  removeUnit(instanceId: string): void {
    this.units = this.units.filter(u => u.instanceId !== instanceId);
  }

  markContested(): void {
    this.state = BattlefieldControlState.CONTESTED;
  }

  markControlled(player: PlayerId): void {
    this.state = BattlefieldControlState.CONTROLLED;
    this.controller = player;
  }

  markOpen(): void {
    this.state = BattlefieldControlState.OPEN;
    this.controller = null;
  }

  canScore(player: PlayerId): boolean {
    return !this.scoredThisTurn.has(player) && this.controller === player;
  }

  markScored(player: PlayerId): void {
    this.scoredThisTurn.add(player);
  }

  resetScored(): void {
    this.scoredThisTurn.clear();
  }

  hideCard(card: Card): void {
    this.facedownCard = card;
  }

  removeFacedown(): void {
    this.facedownCard = null;
  }
}