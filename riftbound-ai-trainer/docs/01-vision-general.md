# Visión General

## ¿Qué queremos construir?

Una plataforma de entrenamiento para **Riftbound** (el TCG de League of Legends de Riot Games) que permita a un jugador humano mejorar su nivel de juego enfrentándose a un oponente IA de alto nivel y recibiendo análisis bajo demanda de un Coach IA.

El sistema se compone de **5 agentes independientes** orquestados por un servicio central, cada uno con una responsabilidad única y bien definida.

## ¿Por qué Riftbound y no Magic: The Gathering?

| Aspecto | Magic: The Gathering | Riftbound |
|---------|----------------------|-----------|
| Sistema de recursos | Robo de tierras (alta variabilidad) | Runas determinista (2 por turno) |
| Condición de victoria | Reducir 20 vidas | Conseguir 8 puntos de victoria |
| Mecánica central | Stack LIFO complejo | Cadenas FEPR modernas |
| Tablero | Sin posicionamiento espacial | 3 battlefields con control de área |
| Mecánicas únicas | Girar, daño permanente | Showdowns, Ganking, Deflect, Reciclar |

Riftbound elimina la variabilidad del "mana screw/flood" y se centra en la estrategia pura de control de battlefields y gestión de runas.

## Principios de Diseño

1. **Modularidad** — Cada agente es independiente, reemplazable y testeable de forma aislada
2. **Única fuente de verdad** — El `TableManagerService` es el único que modifica el estado del juego
3. **Validación externa** — Toda acción pasa por el `JudgeService` (LLM + RAG) antes de ejecutarse
4. **Feedback bajo demanda** — El `CoachService` solo analiza cuando el jugador lo solicita explícitamente
5. **Agentes desacoplados** — Ningún agente conoce al `OrchestratorService` ni a otros agentes
6. **Interfaces tipadas** — Cada agente expone una interfaz clara con entrada y salida bien definidas
7. **Código en inglés** — Todo el código fuente usa nombres en inglés; la documentación, en español

## Agentes del Sistema

| Agente | Servicio NestJS | Rol | Dependencias |
|--------|-----------------|-----|--------------|
| Orquestador Central | `OrchestratorService` | Director de la partida, coordina el flujo de turnos | Los otros 4 servicios |
| Gestor de Mesa | `TableManagerService` | Única fuente de verdad del estado de juego | Ninguna |
| Juez de Reglas | `JudgeService` | Valida la legalidad de las acciones (LLM + RAG) | VectorStore, LLMClient |
| Sparring Agent | `SparringService` | Oponente IA de alto nivel (nivel fijo en MVP) | LLMClient |
| Coach Agent | `CoachService` | Analiza decisiones y sugiere alternativas (bajo demanda) | VectorStore, LLMClient |

## Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Lenguaje | TypeScript 5.x |
| Runtime | Node.js |
| Framework | NestJS |
| Validación de datos | Zod |
| API + WebSocket | NestJS Gateway (Socket.IO) |
| Base de datos vectorial | ChromaDB (cliente JS nativo) |
| Base de datos relacional | SQLite (better-sqlite3) |
| LLMs | A decidir (DeepSeek, Claude, GPT-4) |
| Tests | Vitest |

## Alcance del MVP

- Partidas 1 vs 1 (humano vs Sparring)
- Subset inicial de cartas (~50)
- Juez con LLM + RAG sobre reglas oficiales
- Coach bajo demanda (el jugador pulsa "analizar")
- Sparring con nivel fijo avanzado (sin adaptación ni memoria)
- Interfaz textual o mínima (a decidir)

## Lo que NO entra en el MVP

- Adaptación del Sparring al estilo del jugador (DDA)
- Memoria de partidas ni grafo de conocimiento
- Capa de validación determinista en el Juez
- Interfaz gráfica completa
- Dataset completo de cartas
- Soporte multijugador (2v2, 4 jugadores)
