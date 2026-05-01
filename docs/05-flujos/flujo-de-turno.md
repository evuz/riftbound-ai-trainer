# Flujo de Turno

## Diagrama de secuencia

```
Jugador Humano -> [Propone acción vía UI]
     |
     v
GameGateway -> Orchestrator.processHumanAction(action)
     |
     v
Orchestrator -> JudgeService.validate(state, action, "human")
     |
     +--- No válida ---> [Notificar error a la UI. Volver a esperar acción]
     |
     +--- Válida -------> TableManager.applyAction(action, "human")
                              |
                              v
                         [Si coach solicitado] -> CoachService.analyze(...)
                              |
                              v
                         SparringService.decide(state, "fijo_avanzado")
                              |
                              v
                         JudgeService.validate(state, sparringAction, "sparring")
                              |
                              v
                         TableManager.applyAction(sparringAction, "sparring")
                              |
                              v
                         GameGateway -> UI [Nuevo estado + feedback + acción sparring]
```

## Fases del turno

1. **Start Phase** — Efectos de inicio de turno, reset de unidades exhaustadas
2. **Rune Phase** — Canalizar 2 runas del mazo de runas
3. **Main Phase** — Jugar cartas, mover unidades, activar habilidades
4. **Showdown Phase** — Resolver battlefields en disputa (combate)
5. **Scoring Phase** — Asignar puntos de victoria por battlefields conquistados
6. **End Phase** — Efectos de fin de turno, comprobar condición de victoria (8 puntos)

## Notas de implementación

- El CoachService **no bloquea** el flujo del turno. Su análisis puede llegar después.
- El JudgeService debe ser rápido (< 2s) para no entorpecer la partida.
- Si el SparringService tarda, se puede mostrar un indicador de "thinking..." en la UI.
- La UI solo muestra información pública del estado (no la mano del Sparring).
