# Arquitectura del Sistema

## Diagrama General

```
[UI] <--WebSocket--> [GameGateway (NestJS)]
                         |
                 [OrchestratorService]
                         |
    +--------+--------+--------+--------+
    |        |        |        |        |
[TableMgr] [Judge] [Sparring] [Coach]
    |        |        |        |
[GameState] [VectorStore] [LLMClient] [VectorStore]
            [LLMClient]              [LLMClient]
```

## Stack Tecnológico

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Lenguaje | TypeScript 5.x | Tipado fuerte, mismo lenguaje en todo el stack |
| Runtime | Node.js | Ecosistema maduro para aplicaciones en tiempo real |
| Framework | NestJS | Inyección de dependencias, WebSocket Gateway nativo, arquitectura modular |
| Validación | Zod | Schemas en runtime con inferencia automática de tipos TS |
| API + WebSocket | NestJS Gateway con Socket.IO | Tiempo real bidireccional |
| BD Vectorial | ChromaDB | Cliente JavaScript nativo, sin dependencia de Python en runtime |
| BD Relacional | SQLite (better-sqlite3) | Ligera, sin servidor, perfecta para MVP |
| LLMs | DeepSeek / Claude / GPT-4 (vía API HTTP) | Razonamiento estratégico |
| Tests | Vitest | Rápido, compatible con ecosistema Vite, nativo ESM |

## Agentes del Sistema

### 1. TableManagerService (Gestor de Mesa)

- **Rol:** Única fuente de verdad del estado de juego
- **Tipo:** Determinista, sin IA, sin dependencias externas
- **Responsabilidades:**
  - Mantener y actualizar el estado completo del juego
  - Ejecutar transiciones de estado una vez validadas por el Juez
  - Servir el estado actual a quien lo solicite
  - Inicializar nuevas partidas

```
Entrada:  Action + player
Salida:   GameState actualizado
```

### 2. JudgeService (Juez de Reglas)

- **Rol:** Validar la legalidad de cualquier acción propuesta
- **Tipo:** LLM + RAG sobre reglas oficiales
- **Responsabilidades:**
  - Recibir estado del juego y acción propuesta
  - Consultar reglas relevantes en ChromaDB
  - Solicitar veredicto al LLM
  - Devolver si la acción es válida y por qué

```
Entrada:  GameState + Action propuesta + player
Salida:   { valid: boolean, explanation: string, ruleApplied?: string }
```

### 3. SparringService (Oponente IA)

- **Rol:** Jugador oponente con nivel de juego experto
- **Tipo:** LLM con razonamiento estratégico
- **Responsabilidades:**
  - Analizar el estado del juego desde su perspectiva
  - Generar líneas de juego candidatas
  - Seleccionar y devolver la mejor acción
  - Para el MVP: nivel fijo avanzado, sin adaptación ni memoria

```
Entrada:  GameState + difficultyLevel
Salida:   { action: Action, reasoning?: string }
```

### 4. CoachService (Tutor)

- **Rol:** Analizar decisiones del jugador y sugerir alternativas
- **Tipo:** LLM + RAG sobre documentos de estrategia
- **Responsabilidades:**
  - Recibir estado antes, acción tomada, y estado después
  - Consultar conceptos estratégicos en ChromaDB
  - Generar análisis y alternativas
  - **Solo se activa bajo demanda explícita del jugador**

```
Entrada:  GameState (antes) + Action tomada + GameState (después)
Salida:   { analysis: string, alternatives: PlayAlternative[], strategicConcept?: string }
```

### 5. OrchestratorService (Orquestador Central)

- **Rol:** Director de la partida, único punto de coordinación
- **Tipo:** Servicio NestJS que orquesta a los otros 4
- **Responsabilidades:**
  - Iniciar partidas
  - Gestionar el flujo de turnos y fases
  - Recibir acciones del humano, pasarlas por el Juez, ejecutarlas
  - Solicitar y ejecutar la acción del Sparring
  - Invocar al Coach solo cuando el jugador lo pide
  - Notificar cambios de estado al GameGateway

```
Dependencias: TableManagerService, JudgeService, SparringService, CoachService
Expuesto vía: GameGateway (WebSocket)
```

## Comunicación entre Agentes

Todos los agentes viven en el mismo runtime de Node.js. La comunicación es mediante **llamadas directas a métodos** (async/await).

```typescript
// Estas llamadas las hace el OrchestratorService

tableManager.getState()
tableManager.applyAction(action, player)

judgeService.validate({ state, action, player })

sparringService.decide({ state, level })

coachService.analyze({ stateBefore, actionTaken, stateAfter })
```

- **Ningún agente** conoce al OrchestratorService ni a otros agentes
- **Solo el Orchestrator** tiene la visión completa del flujo
- **El Coach se invoca con await** en el MVP (bajo demanda). Si en el futuro se automatiza, se puede lanzar sin await para no bloquear

## Flujo de un Turno

```
1. Orchestrator notifica a la UI: "Turno del jugador humano"
2. UI envía acción del jugador vía WebSocket
3. Orchestrator llama a judgeService.validate(estado, accion, "human")
4. Si no es válida:
   -> Orchestrator notifica error a la UI
   -> Vuelve al paso 2
5. Si es válida:
   -> Orchestrator llama a tableManager.applyAction(accion, "human")
   -> Orchestrator notifica nuevo estado a la UI
   [Si el jugador pidió análisis:]
   -> Orchestrator llama a coachService.analyze(...)
   -> Orchestrator envía feedback a la UI
6. Orchestrator llama a sparringService.decide(estado, "fijo_avanzado")
7. Orchestrator llama a judgeService.validate(estado, accionSparring, "sparring")
8. Orchestrator llama a tableManager.applyAction(accionSparring, "sparring")
9. Orchestrator notifica nuevo estado a la UI
10. Vuelve al paso 1 (siguiente turno)
```

## Almacenamiento

| Dato | Ubicación | Tecnología |
|------|-----------|------------|
| Estado de partida activa | Memoria del proceso Node.js | Variable en TableManagerService |
| Histórico de partidas | Base de datos relacional | SQLite |
| Cartas (dataset) | Archivos JSON en data/ | Sistema de archivos |
| Reglas del juego (RAG) | Base de datos vectorial | ChromaDB |
| Estrategia (RAG) | Base de datos vectorial | ChromaDB |
| Memoria del Sparring | No implementado en MVP | Graphology (futuro) |

## Estructura del Código

```
src/
├── core/
│   ├── game-state.ts
│   ├── game-state.schema.ts
│   ├── actions.ts
│   └── types.ts
│
├── agents/
│   ├── orchestrator/
│   │   └── orchestrator.service.ts
│   ├── table-manager/
│   │   └── table-manager.service.ts
│   ├── judge/
│   │   └── judge.service.ts
│   ├── sparring/
│   │   └── sparring.service.ts
│   └── coach/
│       └── coach.service.ts
│
├── rag/
│   ├── vector-store.service.ts
│   ├── rules-indexer.ts
│   └── strategy-indexer.ts
│
├── llm/
│   └── llm-client.ts
│
├── api/
│   ├── game.module.ts
│   └── game.gateway.ts
│
└── main.ts
```

## Interfaces de los Agentes (contratos TypeScript)

### ITableManager

```typescript
interface ITableManager {
  getState(): GameState;
  applyAction(action: Action, player: Player): GameState;
  startGame(humanDeck: Card[], sparringDeck: Card[]): GameState;
  advancePhase(): GameState;
}
```

### IJudgeService

```typescript
interface IJudgeService {
  validate(request: JudgeRequest): Promise<Verdict>;
}

interface JudgeRequest {
  state: GameState;
  proposedAction: Action;
  player: Player;
}

interface Verdict {
  valid: boolean;
  explanation: string;
  ruleApplied?: string;
}
```

### ISparringService

```typescript
interface ISparringService {
  decide(request: SparringRequest): Promise<SparringResponse>;
}

interface SparringRequest {
  state: GameState;
  level: DifficultyLevel;
}

interface SparringResponse {
  action: Action;
  reasoning?: string;
}
```

### ICoachService

```typescript
interface ICoachService {
  analyze(request: CoachRequest): Promise<CoachFeedback>;
}

interface CoachRequest {
  stateBefore: GameState;
  actionTaken: Action;
  stateAfter: GameState;
}

interface CoachFeedback {
  analysis: string;
  alternatives: PlayAlternative[];
  strategicConcept?: string;
}

interface PlayAlternative {
  description: string;
  pros: string;
  cons: string;
}
```
