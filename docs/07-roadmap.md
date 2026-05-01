# Roadmap

## Fase 0 — Dataset y Documentación ✅

- [x] Definir arquitectura del sistema
- [x] Definir agentes, responsabilidades e interfaces
- [x] Seleccionar stack tecnológico (TypeScript, NestJS, ChromaDB, SQLite)
- [x] Modelo de datos definido (enums e interfaces)
- [x] Dataset Origins (OGN) descargado desde RiftCodex API
- [x] Documentación actualizada (visión, arquitectura, agentes, datos, flujos)

## Fase 1 — TableManagerService

Motor del estado del juego. Sin dependencias externas. Primer módulo implementable.

- [ ] Inicializar proyecto NestJS mínimo
- [ ] Implementar tipos y esquemas Zod (GameState, Cards, Actions)
- [ ] Inicializar partida: mazos, runes, legend, battlefields, mano inicial, mulligan
- [ ] Fases del turno: Awaken, Beginning, Channel, Draw, Main, Ending
- [ ] Acciones básicas: jugar unidad, jugar gear, jugar spell, mover unidades
- [ ] Rune pool: añadir energía/poder, gastar, vaciado al final del turno
- [ ] Control de battlefields y movimientos
- [ ] Tests unitarios del estado del juego

## Fase 2 — Motor de Reglas (FEPR)

Validación determinista de acciones. Sin LLM. Basado en Core Rules.

- [ ] Sistema de cadenas (Chain): Pending Items, Finalized Items, FEPR
- [ ] Validación de costes: energía, poder, dominios requeridos
- [ ] Validación de timing: fases, prioridad, Open/Closed State
- [ ] Targeting: selección de objetivos válidos
- [ ] Showdowns y sistema de combate
- [ ] Condiciones de victoria (8 puntos, Final Point)
- [ ] Tests unitarios de reglas

## Fase 3 — JudgeService

Validación con LLM + RAG para casos complejos que requieren interpretación.

- [ ] Indexar Core Rules en ChromaDB
- [ ] Diseñar prompt del juez
- [ ] Implementar JudgeService usando TableManager + ChromaDB + LLM
- [ ] Tests de validación con cartas reales del dataset OGN

## Fase 4 — SparringService y CoachService

Agentes con LLM para oponente y tutor.

- [ ] Diseñar prompt del Sparring (rol, estrategia, formato de respuesta)
- [ ] Implementar SparringService
- [ ] Diseñar prompt del Coach (análisis, alternativas, concepto estratégico)
- [ ] Implementar CoachService (bajo demanda)
- [ ] Indexar documentos de estrategia en ChromaDB

## Fase 5 — OrchestratorService y API

Coordinación central y exposición del sistema.

- [ ] Implementar OrchestratorService
- [ ] WebSocket Gateway (NestJS + Socket.IO)
- [ ] Interfaz mínima (CLI o web)
- [ ] Integración completa de todos los agentes
- [ ] Flujo de partida completo funcional

## Fase 6 — Pulido y Expansión

- [ ] Persistencia de partidas en SQLite (games, actions_log, coach_feedback)
- [ ] Historial y revisión de partidas
- [ ] Múltiples niveles de dificultad del Sparring
- [ ] Memoria de partidas y adaptación (DDA)
- [ ] Más sets de cartas (SFD, UNL)
- [ ] Editor de mazos
- [ ] Soporte multijugador (2v2, FFA3, FFA4)
