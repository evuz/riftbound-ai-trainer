# OrchestratorService (Orquestador Central)

## Rol

Director de la partida y único punto de coordinación del sistema. Es el servicio que conecta a todos los demás agentes sin que ellos se conozcan entre sí.

## Tipo

Servicio NestJS con orquestación manual (async/await). Sin dependencia de librerías de flujo externas.

## Responsabilidades

- Iniciar nuevas partidas (recibir mazos, inicializar estado)
- Gestionar el flujo de turnos y fases
- Recibir acciones del jugador humano vía WebSocket (GameGateway)
- Pasar cada acción por el JudgeService para validación
- Ejecutar acciones validadas a través de TableManagerService
- Solicitar y ejecutar la acción del SparringService
- Invocar al CoachService solo bajo demanda explícita del jugador
- Notificar cambios de estado y feedback al GameGateway

## Dependencias

```typescript
@Injectable()
export class OrchestratorService {
  constructor(
    private readonly tableManager: TableManagerService,
    private readonly judge: JudgeService,
    private readonly sparring: SparringService,
    private readonly coach: CoachService,
  ) {}
}
```

- TableManagerService — ejecuta acciones y mantiene el estado
- JudgeService — valida legalidad de acciones
- SparringService — decide la jugada del oponente
- CoachService — analiza decisiones del jugador

## Interfaces

### Entrada (métodos públicos)

```typescript
interface IOrchestrator {
  startGame(humanDeckId: string, sparringDeckId: string): Promise<GameState>;
  processHumanAction(action: Action): Promise<TurnResult>;
  requestCoachFeedback(): Promise<CoachFeedback | null>;
  getState(): GameState;
}
```

### Salida (respuestas)

```typescript
interface TurnResult {
  state: GameState;
  verdict: Verdict;
  coachFeedback?: CoachFeedback;
  sparringAction?: Action;
  sparringReasoning?: string;
}
```

## Flujo interno

```
processHumanAction(action):
  1. verdict = await judge.validate({ state, action, "human" })
  2. if (!verdict.valid) -> return { state, verdict }
  3. state = tableManager.applyAction(action, "human")
  4. if (coachRequested) -> coachFeedback = await coach.analyze(...)
  5. sparringResponse = await sparring.decide({ state, "fijo_avanzado" })
  6. sparringVerdict = await judge.validate({ state, sparringResponse.action, "sparring" })
  7. state = tableManager.applyAction(sparringResponse.action, "sparring")
  8. return { state, verdict, coachFeedback, sparringAction, sparringReasoning }
```

## Consideraciones de diseño

- Es el **único servicio** que conoce a los demás agentes
- No contiene lógica de juego (esa está en TableManager)
- No contiene lógica de validación (esa está en Judge)
- No contiene lógica estratégica (esa está en Sparring y Coach)
- Su única función es **coordinar el flujo**
- Si en el futuro se añaden más agentes (ej: analista post-partida), solo se añaden aquí
