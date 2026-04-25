# Contexto de la Conversación — Riftbound AI Trainer

**Última actualización:** 25 de abril de 2026
**Estado del proyecto:** Fase de diseño arquitectónico completada. Siguiente paso: modelar GameState con PDF de reglas.

## Origen

El proyecto comenzó como una idea para un sistema multiagente de Magic: The Gathering.
Se evolucionó a Riftbound por sus ventajas: sistema de runas determinista, enfoque en control de battlefields, y mecánicas modernas.

## Decisiones Clave Tomadas

### Plataforma y stack

1. **Plataforma:** Riftbound (TCG de League of Legends de Riot Games)
2. **Lenguaje:** TypeScript 5.x (código en inglés, documentación en español)
3. **Framework:** NestJS (inyección de dependencias, WebSocket Gateway nativo)
4. **Validación:** Zod (schemas en runtime)
5. **BD Vectorial:** ChromaDB (cliente JS nativo)
6. **BD Relacional:** SQLite + better-sqlite3
7. **WebSocket:** NestJS Gateway con Socket.IO
8. **Tests:** Vitest

### Agentes (5 servicios NestJS independientes)

1. **OrchestratorService** — Director de la partida. Único que conoce a los demás agentes.
2. **TableManagerService** — Fuente de verdad del estado. Determinista, sin dependencias externas.
3. **JudgeService** — Valida acciones con LLM + RAG sobre reglas oficiales.
4. **SparringService** — Oponente IA. Nivel fijo avanzado en MVP, sin memoria ni adaptación.
5. **CoachService** — Analiza decisiones bajo demanda con LLM + RAG sobre estrategia.

### Comunicación

- Llamadas directas a métodos (async/await) desde el Orchestrator
- Ningún agente conoce al Orchestrator ni a otros agentes
- Solo el Orchestrator tiene la visión completa del flujo

### MVP

- Coach bajo demanda (el jugador pulsa "analizar")
- Sparring nivel fijo avanzado
- Juez siempre pasa por LLM (sin capa determinista)
- Subset inicial de ~50 cartas
- Interfaz textual o web mínima

### Fuera del MVP

- Adaptación del Sparring (DDA)
- Memoria de partidas / grafo de conocimiento
- Capa determinista en el Juez
- Interfaz gráfica completa
- Dataset completo de cartas
- Soporte multijugador

## Preguntas Abiertas

- ¿API oficial de Riot para cartas de Riftbound?
- ¿Interfaz gráfica o textual para primera versión?
- ¿Modelo de lenguaje concreto? (DeepSeek, Claude, GPT-4)
- ¿Mazos iniciales para el subset de cartas?

## Próximos Pasos Inmediatos

1. Recibir PDF de reglas oficiales de Riftbound
2. Modelar GameState y esquemas Zod con precisión
3. Configurar repositorio NestJS
4. Implementar TableManagerService como primer módulo
5. Crear subset inicial de cartas en JSON

## Historial de Versiones

- v0.1 (25/04/2026): Creación inicial. Arquitectura en Python.
- v0.2 (25/04/2026): Migración completa a TypeScript + NestJS. Definición de interfaces de agentes. Actualización de principios de diseño.
