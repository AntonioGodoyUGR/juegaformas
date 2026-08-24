# Mecánica: emparejar, con modo boca abajo

Status: done
Blocked by: 02, 03, 05

El niño relaciona las piezas que van juntas. Boca abajo es un modo de esta
mecánica, no una mecánica aparte.

## Alcance

- Emparejado por toque
- Modo boca abajo: las piezas empiezan ocultas y se descubren al tocarlas
- La pareja acertada se queda visible; la fallida se vuelve a ocultar en silencio
- El modo se activa dentro del recorrido del nivel, sin pedírselo al niño

## Hecho cuando

- Las dos formas de emparejar comparten la misma lógica de tablero
- Fallar no suena

## Comments

Hecho. Las reglas están en `src/lib/emparejar.ts` y la pantalla en
`src/mecanicas/Emparejar.tsx`, con el mismo reparto que en `encajar`: el fichero
de reglas no importa React y se prueba sin montar nada.

**Boca abajo como modo, no como mecánica.** Aquí es donde esa frase del
`CONTEXT.md` deja de ser una frase. `bocaAbajo` es un campo del tablero que solo
lee una función, `estaVisible`; el reparto, los toques, las parejas y el final
son idénticos en los dos modos. El «hecho cuando» del ticket tiene su propio
`describe` en `src/lib/emparejar.test.ts` —«los dos modos comparten tablero»— que
falla el día que alguien empiece a separarlos, y otro equivalente desde la
pantalla en `src/mecanicas/emparejar.test.tsx`.

**Cuándo se tapa.** `juegaBocaAbajo(completadas)` mide contra
`situacion(...).hechas`, es decir las partidas hechas *dentro del nivel*, no el
total. Con `BOCA_ABAJO_DESDE = 5` sobre un nivel de 15, el niño juega cinco
destapadas de calentamiento y el resto tapadas, sin que nadie le pregunte nada.
Medirlo contra el total tenía dos problemas: en la v1, que entrega un solo
nivel, el corte podía no llegar nunca; y al dar la vuelta al último nivel no
habría calentamiento. Hay un test que se queja si `BOCA_ABAJO_DESDE` se sale del
nivel.

**Tres decisiones que el ticket no fijaba:**

- *Una pareja fallada se recoge sola*, tras 1200 ms. La alternativa era pedir un
  toque para seguir, y ese toque no enseña nada: es el gesto que sobra.
- *Mientras la pareja fallada está a la vista, no se levanta una tercera.* Un
  niño toca rápido; sin esto el tablero acaba entero levantado y deja de tener
  sentido.
- *La pareja hecha se queda `disabled`*, no solo ignorada, para que también
  salga del recorrido del teclado: quien juega tabulando no vuelve a pasar por
  lo que ya ha resuelto.

**Accesibilidad.** Una carta tapada se llama «Carta por descubrir»
(`textos.cartaTapada`, en los dos idiomas); descubierta pasa a llamarse como su
pieza. Poner el nombre de la pieza en una carta tapada sería resolverle el juego
a quien no mira la pantalla. El dibujo de dentro va `decorativa`: el botón ya lo
nombra.

**Fallar no suena.** No hay sonido en el proyecto todavía, así que el criterio
se ha leído como «fallar no avisa»: el test comprueba que al fallar no aparece
ningún `role="alert"` ni `role="status"`, y que la partida sigue jugable.

**Un cambio fuera de la mecánica.** `Ronda`, en `src/vistas/Partida.tsx`, ahora
lleva las partidas completadas en estado en vez de leerlas de `guardado` con un
`+ 1` a mano. De ese número cuelgan tres decisiones —el nivel, cuántas piezas
trae el tablero y si se reparte boca abajo— y con una sola cuenta no puede pasar
que una se quede una partida por detrás de las otras. La `key` de la mecánica es
ahora esa misma cuenta.

Verificado: `npm run typecheck`, `npx vitest run` (13 ficheros, 133 tests) y
`npm run build`, todo en verde. **Sin comprobar a ojo**, igual que el ticket 06:
no hay navegador conectado en esta sesión.
