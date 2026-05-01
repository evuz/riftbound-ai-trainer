# Stack Tecnológico

## Backend

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Lenguaje | TypeScript 5.x | Tipado fuerte, un solo lenguaje para todo el stack |
| Runtime | Node.js 20+ | Ecosistema maduro, gran comunidad |
| Framework | NestJS | Inyección de dependencias, WebSocket nativo, arquitectura modular |
| Validación | Zod | Schemas en runtime con inferencia de tipos |
| ORM (futuro) | Drizzle ORM | Tipado, ligero, compatible con SQLite |
| BD Vectorial | ChromaDB | Cliente JS nativo, embebible, perfecta para RAG |
| BD Relacional | SQLite + better-sqlite3 | Sin servidor, ideal para MVP |
| WebSocket | NestJS Gateway + Socket.IO | Tiempo real bidireccional |
| Tests | Vitest | Rápido, ESM nativo, compatible con TypeScript |
| Linting | Biome | Rápido, unificado (formato + lint), alternativa a ESLint |

## LLMs

| Proveedor | Modelo | Uso |
|-----------|--------|-----|
| DeepSeek | deepseek-chat | Razonamiento estratégico (Sparring, Coach) |
| DeepSeek | deepseek-chat | Validación de reglas (Judge) |
| OpenAI (opcional) | GPT-4o | Alternativa para los agentes |
| Anthropic (opcional) | Claude 3.5 Sonnet | Alternativa para los agentes |

## Frontend (futuro, fuera del MVP)

| Componente | Tecnología |
|------------|------------|
| Framework | React + TypeScript |
| Comunicación | Socket.IO client |
| Estilos | Tailwind CSS |

## Herramientas de desarrollo

| Herramienta | Uso |
|-------------|-----|
| tsx | Ejecutar TypeScript sin compilar |
| Vitest | Tests unitarios y de integración |
| Biome | Linting y formateo |
| ChromaDB | Base de datos vectorial local |
| SQLite | Base de datos relacional local |
