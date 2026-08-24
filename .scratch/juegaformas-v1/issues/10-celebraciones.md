# Celebraciones de partida y de nivel

Status: done
Blocked by: 06, 07, 08

El único premio del juego. No hay puntuación, ni vidas, ni tiempo.

## Alcance

- Breve, al completar una partida: dura poco y encadena con la siguiente
- Grande, al completar un nivel: pantalla propia, y es la que marca que se ha
  desbloqueado el siguiente
- Ninguna de las dos exige tocar la pantalla más de una vez para continuar

## Hecho cuando

- Completar las 15-20 partidas de un nivel dispara la celebración grande y sube
  el nivel guardado

## Comments

Hecho. Las dos celebraciones están en `src/componentes/Celebracion.tsx` y quien
decide cuál toca es `src/vistas/Partida.tsx`, que ya era el sitio donde se
recogía al terminar un tablero.

**Un estado y no dos banderas.** `Celebrando` es `'ninguna' | 'partida' |
'nivel'` porque las dos no se solapan nunca: la grande sustituye a la breve, no
se suma. Las dos empiezan igual —la capa encima del tablero recién resuelto— y
se separan cuando se acaba la pausa: si esta partida cerraba el nivel viene la
pantalla, y si no viene el tablero siguiente. Eso es lo que hace que la cuenta
de toques salga: la breve pide cero y la de nivel pide uno, nunca dos.

**La pausa ya estaba y ahora se ve.** `PAUSA = 900` existía desde el ticket 06
como un respiro sin nada dentro; es ahora `CELEBRACION = 1200`, con la capa
puesta encima. La capa tapa el tablero a los toques a propósito: durante ese
segundo no hay nada que tocar, y un dedo impaciente que acierte una carta ya
resuelta vería responder a un tablero que en realidad está terminado.

**El nivel no se guarda: se anota la partida.** «Sube el nivel guardado» no
añade nada al `Guardado`. `anotarPartida` sube `completadas[mecanica]` y
`situacion()` deriva de ahí el nivel, como desde el ticket 02. Se anota al
terminar el tablero y no al salir de la celebración: si el niño cierra la
aplicación mirando las estrellas, la partida que acaba de resolver ya está
contada. El test lo comprueba por donde se nota —`hechas` vuelve a cero— en vez
de leer un número de nivel que no existe.

**Ninguna de las dos cuenta nada.** Ni cuántas partidas lleva, ni cuántas
faltan, ni qué nivel es este. Enseñar la cuenta convierte jugar en avanzar, y a
los cinco años eso solo sirve para compararse consigo mismo. Por eso las frases
del catálogo no llevan números dentro y las estrellas son tres pero de tamaños
distintos y escalonadas: tres iguales en fila se leen como un contador de tres.

**Lo que no se ve tampoco se oye.** La capa breve es un destello, y un destello
no se oye: lleva `role="status"` para que quien juega con lector de pantalla se
entere de que ha terminado el tablero. En la pantalla de nivel el foco va solo
al botón, porque la pantalla ha sustituido al tablero y el botón que tenía el
foco ya no existe.

`src/vistas/celebraciones.test.tsx` prueba las dos por fuera, con `emparejar`:
terminar un tablero ahí son toques y no arrastres, y lo que se está probando no
es la mecánica sino lo que viene después. Cuidado con `getByRole('status')` en
esos tests: `@dnd-kit` monta su propia región de estado en los tableros con
arrastre, así que se busca por `data-celebracion` o por el texto.

Verificado: `npm run typecheck`, `npx vitest run` (18 ficheros, 212 tests) y
`npm run build`, todo en verde. **Sin comprobar a ojo**, igual que los tickets
06, 07 y 08: no hay navegador conectado en esta sesión.
