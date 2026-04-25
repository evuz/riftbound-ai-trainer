# CoachService (Tutor)

## Rol

Analizar las decisiones del jugador humano y proporcionar feedback constructivo con líneas de juego alternativas. **Solo se activa bajo demanda explícita** del jugador.

## Tipo

Agente que combina **LLM + RAG** (ChromaDB con documentos de estrategia indexados).

## Responsabilidades

- Recibir el estado antes de la acción, la acción tomada, y el estado después
- Buscar en ChromaDB conceptos estratégicos relevantes
- Construir un prompt con estado + acción + estrategia
- Generar un análisis de la decisión
- Proponer líneas de juego alternativas con pros y contras
- Explicar el concepto estratégico subyacente cuando sea relevante

## Dependencias

```typescript
@Injectable()
export class CoachService {
  constructor(
    private readonly vectorStore: VectorStoreService,
    private readonly llmClient: LlmClient,
  ) {}
}
```

- **VectorStoreService** — Para buscar conceptos estratégicos en ChromaDB
- **LlmClient** — Para generar el análisis
- **No conoce** al Orchestrator, TableManager, Judge ni Sparring

## Interfaces

### Entrada

```typescript
interface ICoachService {
  analyze(request: CoachRequest): Promise<CoachFeedback>;
}

interface CoachRequest {
  stateBefore: GameState;
  actionTaken: Action;
  stateAfter: GameState;
}
```

### Salida

```typescript
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

## Flujo de análisis

```
1. Recibir CoachRequest { stateBefore, actionTaken, stateAfter }
2. Buscar en ChromaDB conceptos estratégicos relevantes:
   - Filtrar por tipo de acción y estado del juego
   - Recuperar documentos sobre tempo, control de battlefields, economía de runas
3. Construir prompt para el LLM:
   - System: "Eres un coach de Riftbound. Analiza decisiones y sugiere mejoras..."
   - Context: conceptos estratégicos de ChromaDB
   - Input: estado antes, acción tomada, estado después
4. El LLM analiza la decisión
5. El LLM genera alternativas con pros y contras
6. Devolver CoachFeedback
```

## Estilo del feedback

- **Constructivo**, nunca destructivo
- **Específico**, señalando cartas y battlefields concretos
- **Contextualizado**, explicando el "por qué" estratégico
- **Breve**, idealmente 3-5 frases más las alternativas
- **Formato**: narrativo para el análisis, listado para las alternativas

## Ejemplo de feedback

```json
{
  "analysis": "Has jugado la unidad en el battlefield A, donde ya tenías superioridad. Conquistarás ese punto, pero has dejado B y C sin defender. Tu rival ahora puede mover unidades a ambos y sumar 2 puntos el próximo turno.",
  "alternatives": [
    {
      "description": "Jugar la unidad en el battlefield B en lugar del A",
      "pros": "Disputas un segundo battlefield y limitas los puntos del rival",
      "cons": "No aseguras el punto en A este turno"
    },
    {
      "description": "No jugar la unidad y guardar runas para un hechizo de remoción",
      "pros": "Mantienes recursos para responder a la jugada del rival",
      "cons": "Pierdes tempo al no desarrollar tu tablero"
    }
  ],
  "strategicConcept": "Control de battlefields: no basta con asegurar un punto por turno; también debes negar los puntos del rival. A veces es mejor disputar dos battlefields que conquistar uno solo."
}
```

## Consideraciones

- Solo se activa cuando el jugador lo solicita explícitamente
- En el MVP se invoca con await (bloquea hasta tener respuesta)
- La calidad del feedback depende de la calidad de los documentos de estrategia indexados
- No debe ser condescendiente ni tratar al jugador como novato
- Si no hay alternativas claras, debe reconocer que fue una buena jugada
