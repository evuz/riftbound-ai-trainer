# Reglas (para RAG del Juez y Coach)

## Fuente

Las reglas oficiales de Riftbound publicadas por Riot Games. Para el MVP, se indexarán en ChromaDB para que el JudgeService y el CoachService puedan consultarlas.

## Formato

Documentos Markdown o texto plano que se dividen en chunks y se indexan en una colección de ChromaDB.

## Estructura de indexación

Cada chunk se indexa con metadatos:

```json
{
  "id": "rule_showdown_001",
  "text": "When a unit moves to an empty battlefield, a Showdown is initiated...",
  "metadata": {
    "category": "battlefields",
    "topic": "showdown",
    "version": "1.0",
    "source": "riftbound_official_rules"
  }
}
```

## Categorías de reglas

| Categoría | Temas incluidos |
|-----------|-----------------|
| basic_rules | Turnos, fases, condición de victoria, setup inicial |
| battlefields | Control, conquista, Showdowns, movimiento entre battlefields |
| runes | Canalizar, reciclar, colores, costes de poder |
| card_types | Unit, Spell, Legend, Rune. Cómo funciona cada tipo |
| abilities | Ambush, Ganking, Deflect, Reciclar, y otras habilidades |
| resolution | Sistema FEPR (Finalize, Execute, Pass, Resolve), cadenas |

## Actualización

- Las reglas se indexan una vez al configurar el sistema
- Si Riot publica parches o cambios, se reindexa la colección
- El versionado en los metadatos permite mantener reglas antiguas si es necesario

## Documentos de estrategia (colección separada)

Además de las reglas, ChromaDB tendrá una colección `strategy` con:

| Categoría | Contenido |
|-----------|-----------|
| tempo | Conceptos de tempo, cuándo ser agresivo vs. defensivo |
| card_advantage | Gestión de recursos, value, intercambios |
| battlefield_control | Cómo disputar y controlar los 3 battlefields |
| rune_economy | Cuándo reciclar, cómo gestionar las runas |
| matchups | Cómo jugar contra distintos arquetipos |
