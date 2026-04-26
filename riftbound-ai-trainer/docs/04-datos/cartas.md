# Cartas

## Fuente de datos

Las cartas se obtienen desde la [API de RiftCodex](https://riftcodex.com/docs/endpoints/cards/). El dataset inicial incluye todas las cartas del set **Origins (OGN)**, filtradas para eliminar ediciones especiales (overnumbered, alternate art, metadata.signature, showcase, promo).

## Estructura del dataset

```
data/
└── cartas/
    ├── ogn.json              # Set Origins completo (~260 cartas)
    ├── sfd.json              # Spiritforged (futuro)
    └── unk.json              # Unleashed (futuro)
```

## Script de descarga

```bash
npx tsx fetch-cards-v3.ts
```

El script:
1. Descarga todas las cartas de un set desde RiftCodex
2. Filtra duplicados (overnumbered, alternate_art, metadata.signature, showcase, promo)
3. Convierte marcadores del texto (:rb_exhaust: → [Exhaust], etc.)
4. Parsea keywords
5. Guarda el JSON en data/cartas/

## Tipos de carta

| Tipo | Origen | Zona inicial | Ejemplo |
|------|--------|--------------|---------|
| Unit | Main Deck / Champion Zone | Board (Base o Battlefield) | Jinx, Rebel |
| Gear | Main Deck | Board (Base) | Guardian Angel |
| Spell | Main Deck | Chain → Trash | Cull the Weak |
| Battlefield | Proporcionado al inicio | Battlefield Zone | Void Gate |
| Legend | Proporcionado al inicio | Legend Zone | Jinx - Loose Cannon |
| Rune | Rune Deck | Board (Base) | Fury Rune |

## Campos de una carta

### CardBase (común a todas)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único (riftbound_id) |
| name | string | Nombre de la carta |
| type | CardType | UNIT, GEAR, SPELL, BATTLEFIELD, LEGEND, RUNE |
| domain | Domain[] | Dominios |
| rulesText | string | Texto de reglas limpio |
| flavourText | string? | Texto de sabor |
| keywords | Keyword[] | Keywords detectadas automáticamente |
| tags | string[] | Etiquetas (campeón, especie, facción) |
| rarity | Rarity | COMMON, UNCOMMON, RARE, EPIC |

### Unit

| Campo extra | Tipo | Descripción |
|-------------|------|-------------|
| energyCost | number | Coste de energía |
| powerCost | number | Cantidad de símbolos de poder requeridos |
| might | number | Might base |
| isChampion | boolean | ¿Tiene supertipo Champion? |
| isSignature | boolean | ¿Tiene supertipo Signature? |

### Gear

| Campo extra | Tipo | Descripción |
|-------------|------|-------------|
| energyCost | number | Coste de energía |
| powerCost | number | Cantidad de símbolos de poder requeridos |
| mightBonus | number? | Bonus de Might que aporta |
| isSignature | boolean | ¿Tiene supertipo Signature? |

### Spell

| Campo extra | Tipo | Descripción |
|-------------|------|-------------|
| energyCost | number | Coste de energía |
| powerCost | number | Cantidad de símbolos de poder requeridos |
| isSignature | boolean | ¿Tiene supertipo Signature? |

### Battlefield

| Campo extra | Tipo | Descripción |
|-------------|------|-------------|
| orientation | "portrait" | "landscape" | Orientación de la carta |

### Legend

| Campo extra | Tipo | Descripción |
|-------------|------|-------------|
| championTag | string | Tag del campeón vinculado |
| isSignature | boolean | ¿Tiene supertipo Signature? |

### Rune

Sin campos extra.

## Filtros aplicados

| Filtro | Motivo |
|--------|--------|
| overnumbered: true | Ediciones con numeración extendida (coleccionables) |
| alternate_art: true | Artes alternativos |
| metadata.signature: true | Firmas de artistas |
| rarity: showcase | Ediciones showcase |
| rarity: promo | Ediciones promocionales |

## isSignature

Se obtiene de `classification.supertype === "Signature"`, no de `metadata.signature`. Las cartas Signature son las vinculadas a un campeón (ej: Icathian Rain de Kai'Sa).
