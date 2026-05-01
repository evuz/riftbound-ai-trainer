# Riftbound AI Trainer

Sistema multiagente de entrenamiento para **Riftbound**, el TCG de League of Legends de Riot Games.

## 🎯 Objetivo

Plataforma donde un jugador humano se enfrenta a un oponente IA de alto nivel y recibe análisis estratégico bajo demanda de un Coach IA.

## 🧠 Agentes del Sistema

| Agente | Servicio | Rol |
|--------|----------|-----|
| Orquestador Central | `OrchestratorService` | Director de la partida, coordina el flujo de turnos |
| Gestor de Mesa | `TableManagerService` | Única fuente de verdad del estado de juego |
| Juez de Reglas | `JudgeService` | Valida la legalidad de las acciones (LLM + RAG) |
| Sparring Agent | `SparringService` | Oponente IA de alto nivel |
| Coach Agent | `CoachService` | Analiza decisiones y sugiere alternativas (bajo demanda) |

## 🛠️ Stack

| Componente | Tecnología |
|------------|------------|
| Lenguaje | TypeScript 5.x |
| Framework | NestJS |
| Validación | Zod |
| BD Vectorial | ChromaDB |
| BD Relacional | SQLite |
| WebSocket | NestJS Gateway + Socket.IO |
| Tests | Vitest |

## 📁 Estructura

- `docs/` — Documentación completa del proyecto
- `src/` — Código fuente
- `data/` — Datasets de cartas, reglas, estrategia
- `tests/` — Tests

## 🚀 Arranque rápido

```bash
# Instalar dependencias
npm install

# Ejecutar scripts de generación de documentación
npx ts-node setup.ts
npx ts-node update-docs.ts
npx ts-node update-agents.ts
npx ts-node update-root.ts

# Iniciar el backend (cuando esté implementado)
npm run dev
```

## 📖 Documentación

Consulta el [índice de documentación](docs/00-indice.md) para navegar por todos los documentos del proyecto.
