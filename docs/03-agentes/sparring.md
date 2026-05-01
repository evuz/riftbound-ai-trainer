# SparringService (Oponente IA)

## Rol

Jugador oponente controlado por IA. Para el MVP, juega a un **nivel fijo avanzado**, sin adaptación al estilo del jugador humano.

## Tipo

Agente basado en **LLM** con capacidad de razonamiento estratégico. No usa RAG en el MVP (no necesita consultar reglas, solo decidir jugadas).

## Responsabilidades

- Analizar el estado del juego desde la perspectiva del oponente
- Generar líneas de juego candidatas
- Evaluar cuál es la mejor acción en función del estado
- Devolver la acción elegida junto con un razonamiento opcional
- Para el MVP: **nivel fijo avanzado, sin memoria ni adaptación**

## Dependencias

```typescript
@Injectable()
export class SparringService {
  constructor(
    private readonly llmClient: LlmClient,
  ) {}
}
```

- **LlmClient** — Para consultar al modelo de lenguaje
- **No conoce** al Orchestrator, TableManager, Judge ni Coach

## Interfaces

### Entrada

```typescript
interface ISparringService {
  decide(request: SparringRequest): Promise<SparringResponse>;
}

interface SparringRequest {
  state: GameState;
  level: DifficultyLevel;
}

type DifficultyLevel = "fijo_avanzado"; // Solo este nivel en MVP
```

### Salida

```typescript
interface SparringResponse {
  action: Action;
  reasoning?: string;
}
```

## Flujo de decisión

```
1. Recibir SparringRequest { state, level }
2. Construir prompt para el LLM:
   - System: "Eres un jugador experto de Riftbound. Tu objetivo es ganar..."
   - Input: estado del juego (solo información visible para el oponente)
3. El LLM genera líneas de juego candidatas (Chain-of-Thought)
4. El LLM selecciona la mejor acción
5. Devolver { action, reasoning }
```

## Ejemplo de prompt

```
System: Eres un jugador experto de Riftbound jugando un mazo de control.
Analiza el estado del juego, genera 3 líneas de juego posibles, y elige la mejor.
Responde en formato JSON:
{
  "reasoning": "análisis paso a paso",
  "action": { "type": "...", ... }
}

Estado del juego:
- Tus puntos: 3. Puntos del rival: 2.
- Battlefield A: controlas con 2 unidades. Battlefield B: vacío. Battlefield C: rival controla con 1 unidad.
- Tu mano: [carta1, carta2, ...]
- Tus runas canalizadas: [Azul, Azul, Naranja]
- ...

¿Cuál es tu mejor jugada?
```

## Consideraciones

- Solo debe ver la **información pública** del estado del juego
- No puede ver la mano del jugador humano
- El campo `reasoning` es útil para debug y para mostrar el "pensamiento" del oponente
- En el futuro (Fase 3) se añadirá memoria de partidas y adaptación (DDA)
- Se pueden añadir más niveles de dificultad cambiando el prompt del sistema
