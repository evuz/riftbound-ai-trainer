# Modelo de Datos — Riftbound AI Trainer

> Basado en Riftbound Core Rules (RUP3). Modo de juego: 1v1 Duel.
> Victory Score: 8 puntos. 2 Battlefields. 40 cartas Main Deck. 12 runas.

---

## Enums

### CardType

```typescript
enum CardType {
  UNIT = "unit",
  GEAR = "gear",
  SPELL = "spell",
}
```

### Domain

```typescript
enum Domain {
  FURY = "fury",
  CALM = "calm",
  MIND = "mind",
  BODY = "body",
  CHAOS = "chaos",
  ORDER = "order",
}
```

### Rarity

```typescript
enum Rarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  LEGENDARY = "legendary",
}
```

### TurnPhase

```typescript
enum TurnPhase {
  AWAKEN = "awaken",
  BEGINNING = "beginning",
  CHANNEL = "channel",
  DRAW = "draw",
  MAIN = "main",
  ENDING = "ending",
}
```

### BattlefieldControlState

```typescript
enum BattlefieldControlState {
  OPEN = "open",
  CONTESTED = "contested",
  CONTROLLED = "controlled",
}
```

### Player

```typescript
enum Player {
  HUMAN = "human",
  SPARRING = "sparring",
}
```

### ChainItemStatus

```typescript
enum ChainItemStatus {
  PENDING = "pending",
  FINALIZED = "finalized",
}
```

### ShowdownType

```typescript
enum ShowdownType {
  NON_COMBAT = "non_combat",
  COMBAT = "combat",
}
```

### ShowdownPhase

```typescript
enum ShowdownPhase {
  SHOWDOWN = "showdown",
  DAMAGE = "damage",
  RESOLUTION = "resolution",
}
```

### CombatDesignation

```typescript
enum CombatDesignation {
  ATTACKER = "attacker",
  DEFENDER = "defender",
}
```

### Keyword

```typescript
enum Keyword {
  ACCELERATE = "accelerate",
  ACTION = "action",
  AMBUSH = "ambush",
  ASSAULT = "assault",
  BACKLINE = "backline",
  DEATHKNELL = "deathknell",
  DEFLECT = "deflect",
  EQUIP = "equip",
  GANKING = "ganking",
  HIDDEN = "hidden",
  HUNT = "hunt",
  LEGION = "legion",
  LEVEL = "level",
  QUICK_DRAW = "quick_draw",
  REACTION = "reaction",
  REPEAT = "repeat",
  SHIELD = "shield",
  TANK = "tank",
  TEMPORARY = "temporary",
  UNIQUE = "unique",
  VISION = "vision",
  WEAPONMASTER = "weaponmaster",
}
```

---

## Interfaces del Modelo

### GameState

```typescript
interface GameState {
  human: PlayerState;
  sparring: PlayerState;
  battlefields: [Battlefield, Battlefield];
  turnNumber: number;
  activePlayer: Player;
  phase: TurnPhase;
  chain: ChainItem[];
  showdown: ShowdownState | null;
  winner: Player | null;
}
```

### PlayerState

```typescript
interface PlayerState {
  victoryPoints: number;
  hand: Card[];
  mainDeck: Card[];
  runeDeck: RuneCard[];
  channeledRunes: ChanneledRune[];
  base: BaseState;
  legend: LegendCard;
  chosenChampion: UnitCard | null;
  graveyard: Card[];
  banished: Card[];
  runePool: RunePool;
  xp: number;
}
```

### BaseState

```typescript
interface BaseState {
  units: UnitOnBoard[];
  gear: GearCard[];
}
```

### Battlefield

```typescript
interface Battlefield {
  id: number;
  card: BattlefieldCard;
  state: BattlefieldControlState;
  controller: Player | null;
  scoredByHumanThisTurn: boolean;
  scoredBySparringThisTurn: boolean;
  units: UnitOnBoard[];
  facedown: FacedownCard | null;
}
```

### UnitOnBoard

```typescript
interface UnitOnBoard {
  instanceId: string;
  card: UnitCard;
  damage: number;
  exhausted: boolean;
  buffed: boolean;
  mightModifiers: MightModifier[];
  grantedKeywords: GrantedKeyword[];
  attachedGear: GearCard[];
  combatDesignation: CombatDesignation | null;
}
```

### MightModifier

```typescript
interface MightModifier {
  source: string;
  type: ModifierType;
  value: number;
  snapshotMin?: number;
  duration: ModifierDuration;
}

enum ModifierType {
  BASE_OVERRIDE = "base_override",
  INCREASE = "increase",
  DECREASE = "decrease",
}

enum ModifierDuration {
  PERMANENT = "permanent",
  THIS_TURN = "this_turn",
  THIS_COMBAT = "this_combat",
}
```

### GrantedKeyword

```typescript
interface GrantedKeyword {
  keyword: Keyword;
  source: string;
  duration: ModifierDuration;
}
```

### FacedownCard

```typescript
interface FacedownCard {
  card: Card;
  placedBy: Player;
  placedOnTurn: number;
}
```

### Cards

```typescript
type Card = UnitCard | GearCard | SpellCard;

interface CardBase {
  id: string;
  name: string;
  type: CardType;
  domain: Domain[];
  energyCost: number;
  powerCost: number;
  requiredPower: DomainPower[];
  rulesText: string;
  effectText?: string;
  mightBonus?: number;
  keywords: Keyword[];
  tags: string[];
  rarity: Rarity;
}

interface UnitCard extends CardBase {
  type: CardType.UNIT;
  might: number;
  isChampion: boolean;
  isSignature: boolean;
}

interface GearCard extends CardBase {
  type: CardType.GEAR;
}

interface SpellCard extends CardBase {
  type: CardType.SPELL;
}
```

### LegendCard

```typescript
interface LegendCard {
  id: string;
  name: string;
  domains: Domain[];
  championTag: string;
  abilities: AbilityOnCard[];
}
```

### BattlefieldCard

```typescript
interface BattlefieldCard {
  id: string;
  name: string;
  abilities: AbilityOnCard[];
}
```

### RuneCard

```typescript
interface RuneCard {
  id: string;
  domain: Domain;
}
```

### ChanneledRune

```typescript
interface ChanneledRune {
  card: RuneCard;
  exhausted: boolean;
}
```

### RunePool

```typescript
interface RunePool {
  energy: number;
  power: Record<Domain, number>;
}
```

### DomainPower

```typescript
interface DomainPower {
  domain: Domain;
  amount: number;
}
```

### AbilityOnCard

```typescript
type AbilityOnCard =
  | PassiveAbility
  | ActivatedAbility
  | TriggeredAbility
  | DependentKeywordAbility;

interface AbilityBase {
  text: string;
}

interface PassiveAbility extends AbilityBase {
  type: "passive";
}

interface ActivatedAbility extends AbilityBase {
  type: "activated";
  cost: string;
  effect: string;
}

interface TriggeredAbility extends AbilityBase {
  type: "triggered";
  condition: string;
  effect: string;
}

interface DependentKeywordAbility extends AbilityBase {
  type: "dependent_keyword";
  keyword: Keyword;
  dependentText: string;
}
```

---

## Chain

### ChainItem

```typescript
interface ChainItem {
  id: string;
  source: ChainSource;
  controller: Player;
  status: ChainItemStatus;
}

type ChainSource =
  | { type: "spell"; card: SpellCard }
  | { type: "unit"; card: UnitCard }
  | { type: "gear"; card: GearCard }
  | { type: "ability"; description: string; sourceId: string }
  | { type: "add_ability"; description: string; sourceId: string };
```

---

## Showdown / Combat

### ShowdownState

```typescript
interface ShowdownState {
  battlefieldId: number;
  type: ShowdownType;
  attacker: Player;
  defender: Player;
  focusHolder: Player;
  passedPlayers: Player[];
  phase: ShowdownPhase;
}
```

---

## Actions

### Action

```typescript
type Action =
  | PlayUnitAction
  | PlayGearAction
  | PlaySpellAction
  | PlayChosenChampionAction
  | StandardMoveAction
  | ActivateAbilityAction
  | HideCardAction
  | PlayFromFacedownAction
  | PassPhaseAction
  | PassFocusAction
  | PassPriorityAction
  | ConcedeAction;
```

### PlayUnitAction

```typescript
interface PlayUnitAction {
  type: "play_unit";
  cardId: string;
  destination: UnitDestination;
  payAccelerate: boolean;
}

type UnitDestination =
  | { location: "base" }
  | { location: "battlefield"; battlefieldId: number };
```

### PlayGearAction

```typescript
interface PlayGearAction {
  type: "play_gear";
  cardId: string;
  attachToUnitId?: string;
}
```

### PlaySpellAction

```typescript
interface PlaySpellAction {
  type: "play_spell";
  cardId: string;
  targets: TargetChoice[];
  modes?: string[];
  repeatTimes: number;
}
```

### PlayChosenChampionAction

```typescript
interface PlayChosenChampionAction {
  type: "play_chosen_champion";
  destination: UnitDestination;
}
```

### StandardMoveAction

```typescript
interface StandardMoveAction {
  type: "standard_move";
  unitIds: string[];
  destination: UnitDestination;
}
```

### ActivateAbilityAction

```typescript
interface ActivateAbilityAction {
  type: "activate_ability";
  sourceId: string;
  abilityIndex: number;
  targets: TargetChoice[];
}
```

### HideCardAction

```typescript
interface HideCardAction {
  type: "hide_card";
  cardId: string;
  battlefieldId: number;
}
```

### PlayFromFacedownAction

```typescript
interface PlayFromFacedownAction {
  type: "play_from_facedown";
  battlefieldId: number;
  targets: TargetChoice[];
}
```

### Pass actions

```typescript
interface PassPhaseAction {
  type: "pass_phase";
}

interface PassFocusAction {
  type: "pass_focus";
}

interface PassPriorityAction {
  type: "pass_priority";
}

interface ConcedeAction {
  type: "concede";
}
```

---

## TargetChoice

```typescript
type TargetChoice =
  | UnitTarget
  | BattlefieldTarget
  | PlayerTarget
  | LegendTarget
  | RuneTarget
  | GearTarget
  | ChainSpellTarget
  | ChainAbilityTarget
  | GraveyardCardTarget;

interface UnitTarget {
  type: "unit";
  unitId: string;
}

interface BattlefieldTarget {
  type: "battlefield";
  battlefieldId: number;
}

interface PlayerTarget {
  type: "player";
  player: Player;
}

interface LegendTarget {
  type: "legend";
  player: Player;
}

interface RuneTarget {
  type: "rune";
  runeId: string;
}

interface GearTarget {
  type: "gear";
  gearId: string;
}

interface ChainSpellTarget {
  type: "spell_on_chain";
  chainItemId: string;
}

interface ChainAbilityTarget {
  type: "ability_on_chain";
  chainItemId: string;
}

interface GraveyardCardTarget {
  type: "card_in_graveyard";
  cardId: string;
  player: Player;
}
```

---

## Historial (SQLite)

### Tabla: games

```sql
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  winner TEXT,
  human_deck_id TEXT,
  sparring_deck_id TEXT,
  final_score_human INTEGER,
  final_score_sparring INTEGER
);
```

### Tabla: actions_log

```sql
CREATE TABLE actions_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id TEXT NOT NULL,
  turn_number INTEGER NOT NULL,
  player TEXT NOT NULL,
  phase TEXT NOT NULL,
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
  state_before_json TEXT NOT NULL,
  action_json TEXT NOT NULL,
  state_after_json TEXT NOT NULL,
  analysis TEXT NOT NULL,
  alternatives_json TEXT,
  strategic_concept TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (action_log_id) REFERENCES actions_log(id)
);
```

---

## Colecciones ChromaDB (RAG)

### Colección: rules

```typescript
interface RuleChunk {
  id: string;
  text: string;
  metadata: {
    category: RuleCategory;
    topic: string;
    version: string;
    source: string;
  };
}

enum RuleCategory {
  BASIC_RULES = "basic_rules",
  BATTLEFIELDS = "battlefields",
  RUNES = "runes",
  CARD_TYPES = "card_types",
  ABILITIES = "abilities",
  RESOLUTION = "resolution",
}
```

### Colección: strategy

```typescript
interface StrategyChunk {
  id: string;
  text: string;
  metadata: {
    category: StrategyCategory;
    topic: string;
    difficulty: DifficultyLevel;
    source: string;
  };
}

enum StrategyCategory {
  TEMPO = "tempo",
  CARD_ADVANTAGE = "card_advantage",
  BATTLEFIELD_CONTROL = "battlefield_control",
  RUNE_ECONOMY = "rune_economy",
  MATCHUPS = "matchups",
}

enum DifficultyLevel {
  BASIC = "basic",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}
```
