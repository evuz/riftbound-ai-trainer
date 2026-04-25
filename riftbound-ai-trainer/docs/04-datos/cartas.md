# Cartas

## Fuente de datos

Inicialmente crearemos un subset manual de ~50 cartas en formato JSON para desarrollar y probar el sistema.

## Estructura del dataset

```
data/
└── cartas/
    ├── subset-inicial.json     # ~50 cartas para desarrollo
    └── full-dataset.json       # Dataset completo (futuro)
```

## Campos de una carta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único (ej: "rift_001") |
| name | string | Nombre de la carta |
| type | CardType | "unit", "spell", "legend" |
| subtype | string? | Subtipo (ej: "champion") |
| powerCost | number | Coste de poder para jugarla |
| requiredRunes | RuneColor[] | Runas necesarias (ej: ["blue", "orange"]) |
| attack | number? | Ataque base (solo unidades) |
| defense | number? | Defensa base (solo unidades) |
| abilities | string[] | Habilidades: "ambush", "ganking", "deflect", etc. |
| rulesText | string | Texto completo de reglas de la carta |
| rarity | Rarity | "common", "uncommon", "rare", "legendary" |

## Ejemplo de carta

```json
{
  "id": "rift_001",
  "name": "Aurora, the Freljordian Witch",
  "type": "unit",
  "subtype": "champion",
  "powerCost": 3,
  "requiredRunes": ["blue", "blue"],
  "attack": 4,
  "defense": 3,
  "abilities": ["ambush"],
  "rulesText": "Ambush (You may play this during a Showdown.)",
  "rarity": "legendary"
}
```

## Tipos de cartas

| Tipo | Descripción |
|------|-------------|
| unit | Criatura que se juega en un battlefield. Tiene ataque y defensa. |
| spell | Hechizo de efecto inmediato. Va al cementerio tras resolverse. |
| legend | Carta de tipo "comandante" con habilidades únicas y persistentes. |
| rune | Carta de recurso. Se canaliza desde el mazo de runas. No se juega desde la mano. |

## Fuentes futuras

- API oficial de Riot Games (si se publica)
- Scraping de bases de datos comunitarias
- Datasets mantenidos por la comunidad de Riftbound
