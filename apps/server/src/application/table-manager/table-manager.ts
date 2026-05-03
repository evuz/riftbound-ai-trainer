import { Game, DeckConfig, GameState } from '../../domain/entities/game';
import { Player } from '../../domain/entities/player';
import { Card } from '../../domain/entities/card';
import { CardLoader } from '../../infrastructure/persistence/json/card-loader';
import { PlayerId } from '../../domain/enums/player';

export class TableManager {
  private game: Game | null = null;
  private cardLoader: CardLoader;

  constructor(cardLoader: CardLoader) {
    this.cardLoader = cardLoader;
  }

  async startGame(humanDeck: DeckConfig, sparringDeck: DeckConfig): Promise<GameState> {
    const human = this.createPlayer(PlayerId.HUMAN, humanDeck);
    const sparring = this.createPlayer(PlayerId.SPARRING, sparringDeck);

    const humanBf = this.pickBattlefield(humanDeck.battlefieldIds);
    const sparringBf = this.pickBattlefield(sparringDeck.battlefieldIds);

    this.game = new Game();
    this.game.startGame(human, sparring, humanBf, sparringBf);
    return this.game.getState();
  }

  private createPlayer(id: PlayerId, config: DeckConfig): Player {
    const legend = this.cardLoader.getCardById(config.legendId)!;
    const champion = this.cardLoader.getCardById(config.championId)!;
    const deckCards = config.mainDeckIds.map(cardId => this.cardLoader.getCardById(cardId)!);
    const runeCards = config.runeDeckIds.map(cardId => this.cardLoader.getCardById(cardId)!);
    const player = new Player(id, legend, champion, deckCards, runeCards);
    player.shuffleDecks();
    player.drawOpeningHand();
    return player;
  }

  private pickBattlefield(battlefieldIds: string[]): Card {
    const id = battlefieldIds[Math.floor(Math.random() * battlefieldIds.length)];
    return this.cardLoader.getCardById(id)!;
  }

  getState(): GameState {
    if (!this.game) throw new Error('Game not started');
    return this.game.getState();
  }

  advancePhase(): GameState {
    if (!this.game) throw new Error('Game not started');
    this.game.advancePhase();
    return this.game.getState();
  }
}