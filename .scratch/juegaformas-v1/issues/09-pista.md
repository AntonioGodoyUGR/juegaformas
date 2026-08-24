# Pista visual tras varios fallos

Status: done
Blocked by: 06, 07, 08

La pista señala el sitio correcto. Nunca lo resuelve.

## Alcance

- Contador de intentos fallidos por partida
- Tras varios fallos, el destino correcto se marca visualmente
- La marca no coloca la pieza ni avanza el tablero
- El contador se reinicia con cada acierto

## Hecho cuando

- Un niño atascado sale del atasco sin que el juego juegue por él

## Comments

Hecho. El contador vive en `src/lib/pista.ts`, la marca en pantalla en
`src/mecanicas/senal.ts`, y cada mecánica solo dice cuándo falla, cuándo acierta
y qué señalar.

**El contador es un módulo puro y no un trozo de cada tablero.** «Tras varios
fallos» tiene que querer decir lo mismo en las tres mecánicas: si cada una
llevara su cuenta, la pista aparecería antes en una que en otra sin que nadie lo
hubiera decidido. `FALLOS_PARA_PISTA` está escrito una vez. Y no ha entrado en
`encajar.ts`, `emparejar.ts` ni `ordenar.ts`: la pista no es una regla del juego
—el tablero se resuelve igual con ella y sin ella—, así que las reglas no se han
enterado. Vive en el `useState` de cada vista, que es donde vive lo que se ve.

**«Sin que el juego juegue por él» está garantizado por lo que el módulo no
tiene.** No hay ninguna función que coloque nada. Lo máximo que sabe decir
`pista.ts` es a qué destino señalar; mover la pieza sigue siendo del niño, y los
tests lo comprueban en las tres mecánicas: tras la pista, la pieza sigue en la
bandeja, el tablero no ha avanzado y `alTerminar` no se ha llamado.

**Tres mecánicas, tres formas de saber a qué señalar.** En `encajar` el destino
se sabe al fallar y es el hueco de la pieza intentada. En `ordenar`, el sitio de
su eslabón. En `emparejar` no se sabe: fallar es que dos cartas no eran pareja y
ninguna de las dos era «la buena». Por eso el destino se calcula después, cuando
el niño vuelve a levantar una sola carta, con `parejaPendiente`. Es la pista más
fuerte de las tres y aun así no resuelve nada: la carta sigue tapada —dice dónde
está la pareja, no cuál es— y hay que tocarla.

**La pista sigue al niño, no a su primer intento.** El contador guarda el último
destino intentado, no el primero. Un niño que se atasca con una pieza, la deja y
prueba con otra recibe la pista sobre la que tiene en la mano.

**Late, y además se dice.** Un destello no se oye. La marca es `animate-pulse`
más un halo —movimiento y no solo color, porque unos cuantos niños de cada cien
no distinguen dos tonos que a los demás nos parecen distintísimos— y al mismo
tiempo el destino se renombra con `textos.pista.destino` / `textos.pista.pareja`.
La frase se suma al nombre en vez de sustituirlo: quien la oye sigue sabiendo
qué hay ahí. En `encajar` el hueco señalado estrena `role="note"` mientras dura
la pista, porque un `div` sin rol es «genérico» y la mitad de los lectores de
pantalla se saltan su `aria-label`.

**Por partida y no por sesión.** Cada tablero monta su mecánica con una `key`
nueva, así que el contador empieza de cero en cada partida sin una línea de
código dedicada a reiniciarlo.

Verificado: `npm run typecheck`, `npx vitest run` (17 ficheros, 201 tests) y
`npm run build`, todo en verde. **Sin comprobar a ojo**: no hay navegador
conectado en esta sesión, así que el destello está probado por el atributo
`data-pista` y por la etiqueta, no mirándolo.
