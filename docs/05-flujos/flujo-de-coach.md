# Flujo del CoachService

## Activación

El Coach **solo se activa bajo demanda**. El jugador pulsa un botón o envía un comando para solicitar análisis de su última acción.

## Proceso de análisis

```
[Jugador solicita análisis vía UI]
        |
        v
GameGateway -> Orchestrator.requestCoachFeedback()
        |
        v
Orchestrator -> CoachService.analyze({
  stateBefore,
  actionTaken,
  stateAfter
})
        |
        v
[CoachService]
  1. Buscar en ChromaDB conceptos estratégicos relevantes
  2. Construir prompt: sistema + contexto estratégico + estado + acción
  3. Llamar al LLM
  4. Parsear respuesta: analysis + alternatives + strategicConcept
        |
        v
Orchestrator -> GameGateway -> UI
        |
        v
[Jugador ve el feedback en la UI]
```

## Cuándo se puede solicitar

- Después de ejecutar una acción propia (jugar carta, mover unidad, etc.)
- No se puede solicitar durante el turno del Sparring
- Se puede solicitar varias veces por turno (una por acción)

## Estilo del feedback

- **Constructivo**, nunca destructivo
- **Específico**, señalando cartas y battlefields concretos
- **Contextualizado**, explicando el "por qué" estratégico
- **Breve**, 3-5 frases de análisis más 2-3 alternativas

## Ejemplo de interacción

```
Jugador: [Juega una unidad en el battlefield A]
Jugador: [Pulsa "Analizar jugada"]

Coach:
"Has jugado la unidad en el battlefield A, donde ya tenías superioridad.
Aseguras ese punto, pero dejas B y C sin presencia. Tu rival puede mover
unidades a ambos y sumar 2 puntos el próximo turno.

Alternativas:
1. Jugar la unidad en B: disputas un segundo battlefield y limitas
   los puntos del rival, aunque no aseguras A este turno.
2. Guardar la carta y pasar: mantienes recursos para responder a la
   jugada del rival con un hechizo de remoción.

Concepto: Control de battlefields. No basta con asegurar un punto por
turno; también debes negar los puntos del rival."
```
