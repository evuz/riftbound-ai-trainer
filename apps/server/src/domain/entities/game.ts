import { Player } from './player';
import { Battlefield } from './battlefield';
import { Card } from './card';
import { TurnPhase } from '../enums/turn-phase';
import { PlayerId } from '../enums/player';

export interface DeckConfig {
  legendId: string;
  championId: string;
  mainDeckIds: string[];
  runeDeckIds: string[];
  battlefieldIds: string[];
}

export interface GameState {
  turnNumber: number;
  activePlayer: PlayerId;
  phase: TurnPhase;
  winner: PlayerId | null;
  human: PlayerStateSnapshot;
  sparring: PlayerStateSnapshot;
  battlefields: BattlefieldSnapshot[];
}

export interface PlayerStateSnapshot {
  victoryPoints: number;
  handSize: number;
  deckSize: number;
  runeDeckSize: number;
  channeledRuneCount: number;
  xp: number;
  energy: number;
  power: Record<string, number>;
  championInZone: boolean;
  hand: CardSnapshot[];
  channeledRunes: RuneSnapshot[];
}

export interface CardSnapshot {
  id: string;
  name: string;
  type: string;
  domain: string[];
  energyCost: number;
  powerCost: number;
  might?: number;
  keywords: string[];
  tags: string[];
  rarity: string;
  rulesText: string;
}

export interface RuneSnapshot {
  instanceId: string;
  domain: string;
  exhausted: boolean;
}

export interface BattlefieldSnapshot {
  id: number;
  name: string;
  state: string;
  controller: string | null;
  units: UnitSnapshot[];
  facedown: CardSnapshot | null;
}

export interface UnitSnapshot {
  instanceId: string;
  cardId: string;
  name: string;
  might: number;
  currentMight: number;
  damage: number;
  exhausted: boolean;
  buffed: boolean;
  keywords: string[];
  tags: string[];
  designation: string | null;
}

export class Game {
  private players: Map<PlayerId, Player>;
  private battlefields: Battlefield[];
  private turnNumber: number;
  private activePlayer: PlayerId;
  private phase: TurnPhase;
  private winner: PlayerId | null;

  constructor() {
    this.players = new Map();
    this.battlefields = [];
    this.turnNumber = 0;
    this.activePlayer = PlayerId.HUMAN;
    this.phase = TurnPhase.AWAKEN;
    this.winner = null;
  }

  startGame(
    human: Player,
    sparring: Player,
    humanBattlefield: Card,
    sparringBattlefield: Card,
  ): void {
    this.players.set(PlayerId.HUMAN, human);
    this.players.set(PlayerId.SPARRING, sparring);

    this.battlefields = [
      new Battlefield(0, humanBattlefield),
      new Battlefield(1, sparringBattlefield),
    ];

    this.activePlayer = Math.random() < 0.5 ? PlayerId.HUMAN : PlayerId.SPARRING;
    this.turnNumber = 1;
    this.phase = TurnPhase.AWAKEN;
    this.winner = null;
  }

  getPlayer(id: PlayerId): Player | undefined {
    return this.players.get(id);
  }

  getActivePlayer(): Player | undefined {
    return this.players.get(this.activePlayer);
  }

  getOpponent(): Player | undefined {
    const opponentId = this.activePlayer === PlayerId.HUMAN
      ? PlayerId.SPARRING
      : PlayerId.HUMAN;
    return this.players.get(opponentId);
  }

  getBattlefields(): Battlefield[] {
    return this.battlefields;
  }

  advancePhase(): void {
    const player = this.getActivePlayer();
    if (!player) return;

    switch (this.phase) {
      case TurnPhase.AWAKEN:
        // CR 315.1: Ready all game objects
        this.phase = TurnPhase.BEGINNING;
        this.handleScoring(player);
        break;

      case TurnPhase.BEGINNING:
        this.phase = TurnPhase.CHANNEL;
        player.channelRunes(2);
        break;

      case TurnPhase.CHANNEL:
        this.phase = TurnPhase.DRAW;
        player.drawCard();
        player.emptyRunePool();
        break;

      case TurnPhase.DRAW:
        this.phase = TurnPhase.MAIN;
        break;

      case TurnPhase.MAIN:
        this.phase = TurnPhase.ENDING;
        break;

      case TurnPhase.ENDING:
        this.endTurn();
        break;
    }
  }

  private handleScoring(player: Player): void {
    for (const bf of this.battlefields) {
      if (bf.canScore(player.id)) {
        bf.markScored(player.id);
        player.addPoints(1);
        if (player.canWin()) {
          this.winner = player.id;
        }
      }
    }
  }

  private endTurn(): void {
    this.players.forEach(p => p.emptyRunePool());
    this.battlefields.forEach(b => b.resetScored());
    this.activePlayer = this.activePlayer === PlayerId.HUMAN
      ? PlayerId.SPARRING
      : PlayerId.HUMAN;
    this.turnNumber++;
    this.phase = TurnPhase.AWAKEN;
  }

  getState(): GameState {
    const human = this.players.get(PlayerId.HUMAN)!;
    const sparring = this.players.get(PlayerId.SPARRING)!;

    return {
      turnNumber: this.turnNumber,
      activePlayer: this.activePlayer,
      phase: this.phase,
      winner: this.winner,
      human: this.playerToState(human),
      sparring: this.playerToState(sparring),
      battlefields: this.battlefields.map(b => this.battlefieldToState(b)),
    };
  }

  private playerToState(player: Player): PlayerStateSnapshot {
    const pool = player.getRunePool();
    const power: Record<string, number> = {};
    pool.power.forEach((v, k) => { power[k] = v; });

    return {
      victoryPoints: player.getVictoryPoints().value,
      handSize: player.getHandSize(),
      deckSize: player.getDeckSize(),
      runeDeckSize: player.getRuneDeckSize(),
      channeledRuneCount: player.getChanneledRunes().length,
      xp: player.getXp().value,
      energy: pool.energy.value,
      power,
      championInZone: player.getChampion() !== null,
      hand: player.getHand().map(c => cardToSnapshot(c)),
      channeledRunes: player.getChanneledRunes().map(r => runeToSnapshot(r)),
    };
  }

  private battlefieldToState(bf: Battlefield): BattlefieldSnapshot {
    return {
      id: bf.id,
      name: bf.card.name,
      state: bf.getState(),
      controller: bf.getController(),
      units: bf.getUnits().map(u => unitToSnapshot(u)),
      facedown: bf.getFacedown() ? cardToSnapshot(bf.getFacedown()!) : null,
    };
  }
}

function cardToSnapshot(card: Card): CardSnapshot {
  return {
    id: card.id,
    name: card.name,
    type: card.type,
    domain: card.domain,
    energyCost: card.energyCost.value,
    powerCost: card.powerCost,
    might: card.might?.value,
    keywords: card.keywords,
    tags: card.tags,
    rarity: card.rarity,
    rulesText: card.rulesText,
  };
}

function runeToSnapshot(rune: import('./channeled-rune').ChanneledRune): RuneSnapshot {
  return {
    instanceId: rune.instanceId,
    domain: rune.getCard().domain[0] || 'colorless',
    exhausted: rune.isExhausted(),
  };
}

function unitToSnapshot(unit: import('./unit-on-board').UnitOnBoard): UnitSnapshot {
  return {
    instanceId: unit.instanceId,
    cardId: unit.getCard().id,
    name: unit.getCard().name,
    might: unit.getCard().might?.value ?? 0,
    currentMight: unit.currentMight(),
    damage: 0,
    exhausted: unit.isExhausted(),
    buffed: unit.hasBuff(),
    keywords: unit.getCard().keywords,
    tags: unit.getCard().tags,
    designation: unit.getDesignation(),
  };
}