import { describe, it, expect, beforeAll } from 'vitest';
import { TableManager } from './table-manager';
import { CardLoader } from '../../infrastructure/persistence/json/card-loader';
import { DeckConfig } from '../../domain/entities/game';
import { TurnPhase } from '../../domain/enums/turn-phase';

describe('TableManager', () => {
  let cardLoader: CardLoader;
  let tableManager: TableManager;
  let humanDeck: DeckConfig;
  let sparringDeck: DeckConfig;

  beforeAll(async () => {
    cardLoader = new CardLoader();
    await cardLoader.load();

    const furyUnits = cardLoader.getUnits();
    const furyRunes = cardLoader.getRunes();
    const legends = cardLoader.getLegends();
    const battlefields = cardLoader.getBattlefields();
    
    humanDeck = {
      legendId: legends[0].id,
      championId: furyUnits.find(u => u.isChampion)?.id || furyUnits[0].id,
      mainDeckIds: furyUnits.slice(0, 40).map(u => u.id),
      runeDeckIds: furyRunes.slice(0, 12).map(r => r.id),
      battlefieldIds: battlefields.slice(0, 3).map(b => b.id),
    };

    sparringDeck = {
      legendId: legends[1]?.id || legends[0].id,
      championId: furyUnits.find(u => u.isChampion && u.id !== humanDeck.championId)?.id || furyUnits[1]?.id || furyUnits[0].id,
      mainDeckIds: furyUnits.slice(0, 40).map(u => u.id),
      runeDeckIds: furyRunes.slice(0, 12).map(r => r.id),
      battlefieldIds: battlefields.slice(0, 3).map(b => b.id),
    };

    tableManager = new TableManager(cardLoader);
  });

  it('should start a game with valid decks', async () => {
    const state = await tableManager.startGame(humanDeck, sparringDeck);
    expect(state).toBeDefined();
    expect(state.turnNumber).toBe(1);
    expect(state.phase).toBe(TurnPhase.AWAKEN);
    expect(state.winner).toBeNull();
    expect(state.human.handSize).toBe(4);
    expect(state.sparring.handSize).toBe(4);
    expect(state.battlefields).toHaveLength(2);
  });

  it('should advance through all phases', async () => {
    await tableManager.startGame(humanDeck, sparringDeck);

    let state = tableManager.advancePhase();
    expect(state.phase).toBe(TurnPhase.BEGINNING);

    state = tableManager.advancePhase();
    expect(state.phase).toBe(TurnPhase.CHANNEL);
    const activePlayer = state.activePlayer === 'human' ? state.human : state.sparring;
    expect(activePlayer.channeledRuneCount).toBe(2);
    
    state = tableManager.advancePhase();
    expect(state.phase).toBe(TurnPhase.DRAW);

    state = tableManager.advancePhase();
    expect(state.phase).toBe(TurnPhase.MAIN);

    state = tableManager.advancePhase();
    expect(state.phase).toBe(TurnPhase.ENDING);

    state = tableManager.advancePhase();
    expect(state.phase).toBe(TurnPhase.AWAKEN);
    expect(state.turnNumber).toBe(2);
  });

  it('should switch active player on new turn', async () => {
    await tableManager.startGame(humanDeck, sparringDeck);
    const firstPlayer = tableManager.getState().activePlayer;

    tableManager.advancePhase();
    tableManager.advancePhase();
    tableManager.advancePhase();
    tableManager.advancePhase();
    tableManager.advancePhase();
    const state = tableManager.advancePhase();

    expect(state.activePlayer).not.toBe(firstPlayer);
    expect(state.turnNumber).toBe(2);
  });
});