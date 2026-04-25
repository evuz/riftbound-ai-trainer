# Modelo de Datos

## Cartas

Las cartas se almacenan en archivos JSON dentro de `data/cartas/`. Para el MVP usaremos un subset de ~50 cartas.

### Schema de carta

```typescript
interface Card {
  id: string;
  name: string;
  type: CardType;
  subtype?: string;
  powerCost: number;
  requiredRunes: RuneColor[];
  attack?: number;
  defense?: number;
  abilities: string[];
  rulesText: string;
  rarity: Rarity;
}

type CardType = "unit" | "spell" | "legend";
type RuneColor = "blue" | "orange" | "purple" | "green";
type Rarity = "common" | "uncommon" | "rare" | "legendary";
```

### Carta de runa

```typescript
interface RuneCard {
  id: string;
  color: RuneColor;
}
```

Las runas no son cartas jugables, sino recursos que se canalizan desde un mazo separado.

## Estado del Juego (GameState)

```typescript
interface GameState {
  human: PlayerState;
  sparring: PlayerState;
  battlefields: [Battlefield, Battlefield, Battlefield];
  turnNumber: number;
  activePlayer: Player;
  phase: TurnPhase;
  winner: Player | null;
}

interface PlayerState {
  victoryPoints: number;
  hand: Card[];
  deck: Card[];
  runeDeck: RuneCard[];
  channeledRunes: RuneCard[];
  graveyard: Card[];
  banished: Card[];
}

interface Battlefield {
  id: number;
  state: BattlefieldState;
  humanUnits: Unit[];
  sparringUnits: Unit[];
}

interface Unit {
  id: string;
  cardId: string;
  name: string;
  attack: number;
  defense: number;
  damage: number;
  abilities: string[];
  isExhausted: boolean;
}

type Player = "human" | "sparring";
type BattlefieldState = "open" | "conquered" | "contested";
type TurnPhase = "start" | "rune" | "main" | "showdown" | "scoring" | "end";
```

## Acciones

```typescript
type Action =
  | PlayCardAction
  | MoveUnitAction
  | ActivateAbilityAction
  | DeclareAttackAction
  | PassPhaseAction
  | ConcedeAction;

interface PlayCardAction {
  type: "play_card";
  cardId: string;
  battlefieldId?: number;
}

interface MoveUnitAction {
  type: "move_unit";
  unitId: string;
  targetBattlefieldId: number;
}

interface ActivateAbilityAction {
  type: "activate_ability";
  unitId: string;
  abilityName: string;
  targetId?: string;
}

interface DeclareAttackAction {
  type: "declare_attack";
  unitId: string;
  targetUnitId?: string;
}

interface PassPhaseAction {
  type: "pass_phase";
}

interface ConcedeAction {
  type: "concede";
}
```

## Base de datos SQLite (histórico)

### Tabla: games

```sql
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  winner TEXT,
  human_deck_id TEXT,
  sparring_deck_id TEXT
);
```

### Tabla: actions_log

```sql
CREATE TABLE actions_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id TEXT NOT NULL,
  turn_number INTEGER NOT NULL,
  player TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id)
);
```

### Tabla: coach_feedback

```sql
CREATE TABLE coach_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id TEXT NOT NULL,
  action_log_id INTEGER NOT NULL,
  analysis TEXT NOT NULL,
  alternatives_json TEXT,
  strategic_concept TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (action_log_id) REFERENCES actions_log(id)
);
```

## Colecciones ChromaDB (RAG)

### Colección: rules

```typescript
interface RuleDocument {
  id: string;
  text: string;
  metadata: {
    category: string;
    topic: string;
    version: string;
    source: string;
  };
}
```

Categorías: `basic_rules`, `battlefields`, `runes`, `card_types`, `abilities`, `resolution`

### Colección: strategy

```typescript
interface StrategyDocument {
  id: string;
  text: string;
  metadata: {
    category: string;
    topic: string;
    difficulty: "basic" | "intermediate" | "advanced";
    source: string;
  };
}
```

Categorías: `tempo`, `card_advantage`, `battlefield_control`, `rune_economy`, `matchups`
