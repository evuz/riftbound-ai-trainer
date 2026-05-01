# Arquitectura del Sistema

## Diagrama General

```
[UI / CLI] <--WebSocket/HTTP--> [Presentation Layer]
                                      |
                               [Application Layer]
                                      |
    +--------+--------+--------+--------+--------+
    |        |        |        |        |        |
[TableMgr] [Rules]  [Judge] [Sparring] [Coach] [Orchestrator]
    |        |        |        |        |
[Domain Models]  [LLM]  [ChromaDB]  [SQLite]
```

## Principios de Diseño

1. **Domain no conoce Infrastructure**: Los modelos de dominio no importan nada de infraestructura.
2. **No hay interfaces innecesarias**: Si solo hay una implementación, se usa la clase directamente. Las interfaces se crean cuando surge una segunda implementación.
3. **Implementaciones concretas en application**: La lógica de negocio vive aquí.
4. **Adaptadores en infrastructure**: LLM, ChromaDB, SQLite, carga de cartas.
5. **Inyección de dependencias por constructor**: Las dependencias se pasan por constructor como clases concretas.
6. **Código en inglés**: Todo el código fuente usa nombres en inglés. La documentación, en español.
7. **Arquitectura hexagonal (puertos y adaptadores)**: Separación clara entre dominio, aplicación, infraestructura y presentación.

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

## Estructura del Código

```
src/
├── domain/                          # Capa de dominio (sin dependencias externas)
│   ├── models/                      # Entidades, value objects, enums
│   │   ├── card.ts
│   │   ├── deck.ts
│   │   ├── game-state.ts
│   │   ├── player.ts
│   │   ├── battlefield.ts
│   │   ├── chain.ts
│   │   ├── showdown.ts
│   │   ├── rune-pool.ts
│   │   └── actions.ts
│   │
│   ├── enums/                       # Enums compartidos
│   │   ├── card-type.ts
│   │   ├── domain.ts
│   │   ├── rarity.ts
│   │   ├── keyword.ts
│   │   ├── turn-phase.ts
│   │   └── player.ts
│   │
│   ├── schemas/                     # Schemas Zod (validación)
│   │   ├── card.schema.ts
│   │   ├── game-state.schema.ts
│   │   └── actions.schema.ts
│   │
│   └── ports/                       # Interfaces SOLO cuando haya >1 implementación
│
├── application/                     # Capa de aplicación (casos de uso)
│   ├── table-manager/
│   │   ├── table-manager.service.ts
│   │   └── table-manager.service.spec.ts
│   │
│   ├── rules-engine/
│   │   ├── rules-engine.service.ts
│   │   ├── chain-resolver.ts
│   │   ├── combat-resolver.ts
│   │   └── rules-engine.service.spec.ts
│   │
│   ├── judge/
│   │   ├── judge.service.ts
│   │   └── judge.service.spec.ts
│   │
│   ├── sparring/
│   │   ├── sparring.service.ts
│   │   └── sparring.service.spec.ts
│   │
│   ├── coach/
│   │   ├── coach.service.ts
│   │   └── coach.service.spec.ts
│   │
│   └── orchestrator/
│       ├── orchestrator.service.ts
│       └── orchestrator.service.spec.ts
│
├── infrastructure/                  # Capa de infraestructura (adaptadores)
│   ├── persistence/
│   │   ├── sqlite/
│   │   │   ├── sqlite.client.ts
│   │   │   ├── game.repository.ts
│   │   │   └── action-log.repository.ts
│   │   └── json/
│   │       └── card-loader.ts       # Carga cartas desde JSON
│   │
│   ├── llm/
│   │   ├── llm-client.ts
│   │   └── prompts/
│   │       ├── judge.prompt.ts
│   │       ├── sparring.prompt.ts
│   │       └── coach.prompt.ts
│   │
│   ├── rag/
│   │   ├── vector-store.client.ts
│   │   ├── rules-indexer.ts
│   │   └── strategy-indexer.ts
│   │
│   └── config/
│       ├── env.ts
│       └── database.config.ts
│
├── presentation/                    # Capa de presentación
│   ├── api/
│   │   ├── game.module.ts
│   │   ├── game.controller.ts
│   │   └── game.gateway.ts          # WebSocket
│   │
│   └── cli/
│       └── cli.ts
│
├── shared/                          # Utilidades compartidas
│   ├── types.ts
│   ├── logger.ts
│   └── errors.ts
│
└── main.ts                          # Punto de entrada
```

## Dependencias entre capas

```
presentation
    ↓ depende de
application
    ↓ depende de
domain
    ↑ implementado por
infrastructure
```

- **Presentation** conoce Application y Domain
- **Application** conoce Domain e Infrastructure
- **Domain** no conoce a nadie
- **Infrastructure** implementa lo que Application necesita

## Agentes del Sistema

### 1. TableManager (Gestor de Mesa)

- **Capa:** Application
- **Rol:** Única fuente de verdad del estado de juego
- **Tipo:** Determinista, sin IA, sin dependencias externas
- **Dependencias:** Solo modelos de Domain

```
Entrada:  Action + player
Salida:   GameState actualizado
```

### 2. RulesEngine (Motor de Reglas)

- **Capa:** Application
- **Rol:** Validar acciones y resolver cadenas FEPR
- **Tipo:** Determinista, basado en Core Rules
- **Dependencias:** TableManager (lee el estado para validar)

```
Entrada:  GameState + Action propuesta + player
Salida:   { valid: boolean, explanation: string }
```

### 3. JudgeService (Juez de Reglas)

- **Capa:** Application
- **Rol:** Validar con LLM + RAG para casos complejos
- **Tipo:** Agente LLM + ChromaDB
- **Dependencias:** RulesEngine (fallback), VectorStore, LlmClient

```
Entrada:  GameState + Action propuesta + player
Salida:   { valid: boolean, explanation: string, ruleApplied?: string }
```

### 4. SparringService (Oponente IA)

- **Capa:** Application
- **Rol:** Jugador oponente con nivel de juego experto
- **Tipo:** Agente LLM con razonamiento estratégico
- **Dependencias:** LlmClient
- **Para el MVP:** nivel fijo avanzado, sin adaptación ni memoria

```
Entrada:  GameState + difficultyLevel
Salida:   { action: Action, reasoning?: string }
```

### 5. CoachService (Tutor)

- **Capa:** Application
- **Rol:** Analizar decisiones y sugerir alternativas
- **Tipo:** Agente LLM + RAG sobre estrategia
- **Dependencias:** VectorStore, LlmClient
- **Solo se activa bajo demanda explícita del jugador**

```
Entrada:  GameState (antes) + Action tomada + GameState (después)
Salida:   { analysis: string, alternatives: PlayAlternative[], strategicConcept?: string }
```

### 6. OrchestratorService (Orquestador Central)

- **Capa:** Application
- **Rol:** Director de la partida, único punto de coordinación
- **Tipo:** Servicio que orquesta a los otros
- **Dependencias:** TableManager, RulesEngine, JudgeService, SparringService, CoachService

## Comunicación entre Agentes

Todos los agentes viven en el mismo runtime de Node.js. La comunicación es mediante **llamadas directas a métodos** (async/await).

```typescript
// Estas llamadas las hace el OrchestratorService

tableManager.getState()
tableManager.applyAction(action, player)

rulesEngine.validate(state, action, player)

judgeService.validate(state, action, player)

sparringService.decide(state, level)

coachService.analyze({ stateBefore, actionTaken, stateAfter })
```

- **Ningún agente** conoce al OrchestratorService ni a otros agentes
- **Solo el Orchestrator** tiene la visión completa del flujo

## Flujo de un Turno

```
1. Orchestrator notifica a la UI: "Turno del jugador humano"
2. UI envía acción del jugador vía WebSocket
3. Orchestrator → RulesEngine.validate(estado, accion, "human")
4. Si no es válida → notificar error a la UI. Volver a esperar acción
5. Si es válida → TableManager.applyAction(accion, "human")
6. Orchestrator notifica nuevo estado a la UI
   [Si el jugador pidió análisis → CoachService.analyze(...) → feedback a la UI]
7. Orchestrator → SparringService.decide(estado, "fijo_avanzado")
8. Orchestrator → RulesEngine.validate(estado, accionSparring, "sparring")
9. Orchestrator → TableManager.applyAction(accionSparring, "sparring")
10. Orchestrator notifica nuevo estado a la UI
11. Vuelve al paso 1 (siguiente turno)
```

## Almacenamiento

| Dato | Ubicación | Tecnología |
|------|-----------|------------|
| Estado de partida activa | Memoria del proceso Node.js | Variable en TableManager |
| Histórico de partidas | Base de datos relacional | SQLite |
| Cartas (dataset) | Archivos JSON en data/ | Sistema de archivos |
| Reglas del juego (RAG) | Base de datos vectorial | ChromaDB |
| Estrategia (RAG) | Base de datos vectorial | ChromaDB |
| Memoria del Sparring | No implementado en MVP | Graphology (futuro) |
