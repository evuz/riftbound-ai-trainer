# Roadmap

## Fase 0: Fundación (Actual)

- [x] Definir arquitectura del sistema
- [x] Definir agentes, responsabilidades e interfaces
- [x] Seleccionar stack tecnológico (TypeScript + NestJS)
- [ ] Configurar repositorio con estructura `src/`
- [ ] Crear subset inicial de cartas (~50)
- [ ] Modelar GameState y esquemas Zod

## Fase 1: Núcleo del juego

- [ ] Implementar `TableManagerService` (estado, acciones, fases)
- [ ] Implementar `GameState` y esquemas Zod
- [ ] Implementar `JudgeService` con LLM + ChromaDB
- [ ] Indexar reglas oficiales en ChromaDB
- [ ] Implementar `OrchestratorService` (flujo de turnos)
- [ ] Implementar `GameGateway` (WebSocket)
- [ ] Tests unitarios del TableManager y GameState

## Fase 2: IA del oponente

- [ ] Implementar `SparringService` con nivel fijo avanzado
- [ ] Implementar `CoachService` con feedback bajo demanda
- [ ] Indexar documentos de estrategia en ChromaDB
- [ ] Implementar `LlmClient` unificado
- [ ] Interfaz textual para jugar (CLI o web mínima)

## Fase 3: Entrenamiento avanzado

- [ ] Memoria de partidas del Sparring (Graphology)
- [ ] Múltiples niveles de dificultad
- [ ] Adaptación al estilo del jugador (DDA)
- [ ] Análisis post-partida
- [ ] Estadísticas de rendimiento

## Fase 4: Pulido

- [ ] Interfaz gráfica (React)
- [ ] Persistencia de partidas en SQLite
- [ ] Historial y revisión de partidas
- [ ] Exportación de estadísticas

## Fase 5: Expansión

- [ ] Dataset completo de cartas
- [ ] Soporte multijugador (2v2, 4 jugadores)
- [ ] Modo torneo
- [ ] Editor de mazos
