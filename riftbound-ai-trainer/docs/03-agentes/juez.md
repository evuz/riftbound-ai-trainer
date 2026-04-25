# JudgeService (Juez de Reglas)

## Rol

Validar la legalidad de cualquier acción propuesta antes de que se ejecute. Es la barrera que impide jugadas ilegales.

## Tipo

Agente que combina **LLM + RAG** (ChromaDB con reglas oficiales indexadas). Para el MVP, **siempre** consulta al LLM. Una futura capa determinista podrá resolver casos triviales sin llamar al modelo.

## Responsabilidades

- Recibir el estado del juego y la acción propuesta
- Buscar en ChromaDB las reglas relevantes para esa situación
- Construir un prompt con estado + reglas + acción
- Solicitar veredicto al LLM
- Devolver si la acción es válida y una explicación en lenguaje natural

## Dependencias

```typescript
@Injectable()
export class JudgeService {
  constructor(
    private readonly vectorStore: VectorStoreService,
    private readonly llmClient: LlmClient,
  ) {}
}
```

- **VectorStoreService** — Para buscar reglas relevantes en ChromaDB
- **LlmClient** — Para consultar al modelo de lenguaje
- **No conoce** al Orchestrator, TableManager, Sparring ni Coach

## Interfaces

### Entrada

```typescript
interface IJudgeService {
  validate(request: JudgeRequest): Promise<Verdict>;
}

interface JudgeRequest {
  state: GameState;
  proposedAction: Action;
  player: Player;
}
```

### Salida

```typescript
interface Verdict {
  valid: boolean;
  explanation: string;
  ruleApplied?: string;
}
```

## Flujo de validación

```
1. Recibir JudgeRequest { state, proposedAction, player }
2. Buscar en ChromaDB las reglas relevantes:
   - Filtrar por tipo de acción (play_card, move_unit, etc.)
   - Recuperar los chunks de reglas más similares
3. Construir prompt para el LLM:
   - System: "Eres un juez de Riftbound. Evalúa la legalidad..."
   - Context: reglas relevantes de ChromaDB
   - Input: estado del juego + acción propuesta + jugador
4. Llamar al LLM
5. Parsear respuesta: { valid, explanation, ruleApplied }
6. Devolver Verdict
```

## Ejemplo de prompt

```
System: Eres un juez oficial de Riftbound. Tu trabajo es determinar si una acción
propuesta es legal según las reglas del juego. Responde SIEMPRE en formato JSON:
{ "valid": boolean, "explanation": string, "ruleApplied": string }

Context (reglas relevantes):
[Chunks de ChromaDB sobre Showdowns, costes de poder, etc.]

Evalúa:
- Estado del juego: { ... }
- Jugador que propone la acción: "human"
- Acción propuesta: { type: "play_card", cardId: "rift_042", battlefieldId: 1 }

¿Es legal esta acción?
```

## Consideraciones

- Debe ser rápido: idealmente < 2 segundos para no entorpecer la partida
- La explicación debe ser comprensible para el jugador
- Si el LLM no puede determinar la legalidad, debe pecar de conservador (invalidar)
- En el futuro se añadirá una capa determinista para casos triviales
