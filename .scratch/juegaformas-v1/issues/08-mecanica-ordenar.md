# Mecánica: ordenar

Status: done
Blocked by: 02, 03, 05

El niño coloca varias piezas en una secuencia correcta.

## Alcance

- Secuencias por tamaño, por cantidad o por etapas de un proceso
- La lógica habla de inicio y fin, nunca de izquierda y derecha
- Colocar en el sitio equivocado devuelve la pieza en silencio

## Hecho cuando

- Cada secuencia tiene una única solución correcta y es evidente para un niño de
  cinco años

## Comments

Hecho. Las reglas están en `src/lib/ordenar.ts` y la pantalla en
`src/mecanicas/Ordenar.tsx`, con el mismo reparto que en las otras dos mecánicas:
el fichero de reglas no importa React y se prueba sin montar nada.

**«Evidente para un niño de cinco años»: la escalera.** Los sitios vacíos crecen
del inicio al fin, como una rampa. Sin ella, ordenar de pequeño a grande y de
grande a pequeño son igual de razonables, y el tablero tendría dos soluciones:
una que cuenta y otra que no, sin nada en pantalla que las distinga. La rampa lo
dice sin una palabra, que es como hay que decirlo a quien todavía no lee. Lo que
la rampa no hace es resolverlo: el sitio está vacío, no lleva la silueta de lo
que va dentro como en `encajar`. Allí la silueta es la pista de qué pieza es;
aquí sería la respuesta entera.

**Dos criterios y no tres.** Quedan tamaño y cantidad; las etapas de un proceso
se caen de la v1 porque piden dibujos que no existen. El catálogo son cuarenta y
dos piezas sueltas, no series: no hay semilla-brote-árbol, y dibujar esas series
es otro ticket de arte, no de mecánica. Está anotado en el propio tipo
`Criterio`. Los dos que quedan se alternan con `criterioDe(completadas)`, sin
preguntarle nada al niño, igual que el boca abajo del ticket 07.

**Una sola pieza por partida, y es culpa del ADR.** El
`0001-progresion-por-numero-de-piezas` dice que los dibujos no llevan atributos
de dificultad, así que el criterio no se puede *leer* del catálogo: se *aplica*
a una pieza protagonista, `partida.piezas[0]`, dibujada a cinco tamaños o
repetida cinco veces. El número de piezas del nivel se gasta en grados en vez de
en dibujos distintos, de modo que `generarPartida` no ha necesitado tocarse.

**Contar de verdad.** En el criterio de cantidad todas las fichas de la bandeja
ocupan lo mismo —lo que ocupa la mayor—. Si la ficha creciera con la cantidad,
el niño emparejaría tamaños con la escalera y llegaría al final sin haber
contado nada.

**Lo que se ha compartido con `encajar`.** Al llegar la segunda mecánica que
arrastra, dos trozos se han sacado a su sitio en vez de duplicarse o de que
`ordenar` importara de `encajar`:

- `src/lib/cerca.ts`: la geometría de «cerca es suficiente», con su tolerancia y
  sus ocho tests, que ahora usan las dos.
- `src/mecanicas/arrastre.ts`: los sensores, los anuncios para lector de
  pantalla y el adaptador entre `@dnd-kit` y esa geometría.

**Funciones en el catálogo de textos.** `textos.orden` es el único sitio del
catálogo con funciones dentro, y el motivo es la gramática: «Cohete, tamaño 2 de
3» no se monta pegando trozos traducidos por separado, porque cada idioma coloca
el número y la palabra donde quiere. Con una función, cada idioma escribe su
frase entera. Se dice con número y no con «pequeña, mediana, grande» por dos
razones: los adjetivos solo llegan a tres y una secuencia de cinco los deja sin
palabras, y habría que concordarlos con el género de cada una de las cuarenta y
dos piezas.

**Inicio y fin, nunca izquierda y derecha.** En las reglas no aparece ninguna de
las dos palabras: hay grados y sitios numerados desde `INICIO`. El día que el
juego se lea en árabe, la fila se dará la vuelta sola y las reglas no se
enterarán.

Verificado: `npm run typecheck`, `npx vitest run` (16 ficheros, 165 tests) y
`npm run build`, todo en verde. **Sin comprobar a ojo**, igual que los tickets 06
y 07: no hay navegador conectado en esta sesión.
