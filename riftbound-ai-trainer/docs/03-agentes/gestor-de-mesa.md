# TableManagerService (Gestor de Mesa)

## Rol

Única fuente de verdad del estado de juego. Es el **único servicio** autorizado para modificar el `GameState`. No toma decisiones, solo ejecuta.

## Tipo

Servicio NestJS **determinista**, sin dependencias externas, sin llamadas a LLM ni a base de datos.

## Responsabilidades

- Mantener el estado completo del juego en memoria
- Ejecutar transiciones de estado (acciones ya validadas por el Juez)
- Servir el estado actual a quien lo solicite
- Inicializar nuevas partidas desde dos mazos de cartas
- Gestionar las fases del turno
- Robar cartas, canalizar runas, aplicar daño, mover unidades
- Detectar condiciones de victoria (8 puntos)

## Dependencias

```typescript
@Injectable()
export class TableManagerService {
  // Sin dependencias inyectadas
  private state: GameState;
}
```

**Cero dependencias externas.** Solo usa los tipos definidos en `core/`.

## Interfaces

### Entrada

```typescript
interface ITableManager {
  getState(): GameState;
  applyAction(action: Action, player: Player): GameState;
  startGame(humanDeck: Card[], sparringDeck: Card[]): GameState;
  advancePhase(): GameState;
}

type Player = "human" | "sparring";
```

### Salida

Siempre devuelve el `GameState` completo actualizado.

## Acciones que ejecuta

```typescript
type Action =
  | { type: "play_card"; cardId: string; battlefieldId?: number }
  | { type: "move_unit"; unitId: string; targetBattlefieldId: number }
  | { type: "activate_ability"; unitId: string; abilityName: string; targetId?: string }
  | { type: "declare_attack"; unitId: string; targetUnitId?: string }
  | { type: "pass_phase" }
  | { type: "concede" };
```

## Estado que gestiona

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
```

## Por qué determinista

- El estado del juego debe ser **predecible, auditable y testeable**
- La IA puede alucinar; el estado del juego no
- Facilita el testing: se pueden simular estados concretos sin levantar LLMs
- Es la "roca" sobre la que se construye todo el sistema
