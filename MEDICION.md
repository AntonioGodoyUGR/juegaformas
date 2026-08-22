# Medición del experimento

Este proyecto es el banco de pruebas del flujo de agentes de mattpocock/skills.
Se trata de responder a dos preguntas: **¿sube la calidad?** y **¿baja el gasto?**

## Ojo con qué se mide

El flujo **no reduce tokens brutos** — los sube. Añade una entrevista, un spec, un
troceado en tickets y un code-review en subagentes antes y después de escribir código.
Lo que reduce es **retrabajo**. Si solo miras la columna de tokens, el experimento
saldrá negativo aunque el flujo esté funcionando.

La columna que decide es **"¿tuve que rehacer algo?"**.

## Línea base

`mesa` y `sandrago` (mismo stack) hechos sin este flujo. Sirven de referencia
cualitativa: cuánto costaron y cuántas veces hubo que tirar código.

Coste pasivo de las 25 skills medido con `claude plugin details mattpocock-skills`:
**~1609 tokens siempre activos** por sesión, más el on-invoke de cada skill que dispares
(`ask-matt` ~3,8k · `wayfinder` ~4k · `code-review` ~2,1k · `to-tickets` ~1,8k).

## Registro

Una línea por sesión. `/context` durante, `/cost` al cerrar.

| Fecha | Ticket | Sesiones | Tokens | ¿Rehíce algo? | ¿Corregí el rumbo? | Notas |
|---|---|---|---|---|---|---|
| | | | | | | |

## Criterio de decisión (~2 semanas)

- **Retrabajo claramente menor** → compensa, aunque los tokens suban.
- **Retrabajo igual y tokens arriba** → es sobrecoste para este tamaño de proyecto.
  Quedarse solo con `grill-with-docs` y `code-review` sueltos, que son las dos piezas
  con mejor relación valor/coste.
