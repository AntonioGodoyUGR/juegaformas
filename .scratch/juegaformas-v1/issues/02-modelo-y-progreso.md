# Modelo de dominio y progreso en localStorage

Status: done
Blocked by: 01

La lógica pura del juego, en `src/lib/`, sin React. Es donde viven los tests.

## Alcance

- Tipos del dominio con el vocabulario de `CONTEXT.md`: mecánica, tema, pieza,
  nivel y partida
- Tabla de niveles: número de piezas por nivel y mecánica, y cuántas partidas
  tiene un nivel (15-20)
- Generación de una partida: elegir piezas de un tema sin repetir dentro del
  tablero
- Progreso: partidas completadas por mecánica, nivel actual, un solo perfil por
  dispositivo, persistido en `localStorage` con lectura tolerante a datos
  corruptos o ausentes
- Reinicio de progreso

## Hecho cuando

- Tests de la generación de partidas y del avance de nivel
- Un `localStorage` vacío, corrupto o de una versión anterior arranca el juego
  desde cero sin lanzar

## Comments

Módulos: `dominio.ts` (tipos), `piezas.ts` (catálogo), `niveles.ts` (tabla y
derivación del nivel), `partida.ts` (generación) y `progreso.ts` (persistencia).
32 tests en verde.

Tres decisiones que conviene no re-discutir dentro de seis meses:

- **El nivel no se guarda, se deriva** de cuántas partidas lleva completadas la
  mecánica. Guardar las dos cosas permite que se descuadren, y un progreso
  descuadrado en un juego sin cuentas ni soporte no lo arregla nadie.
- **El catálogo de piezas ha caído aquí, no en el 03**, porque la generación de
  partidas no se puede escribir ni testear sin él. El ticket 03 solo dibuja lo
  que este catálogo ya nombra.
- **Agotado el último nivel el juego no termina**: se sigue jugando ese mismo
  nivel. Un niño que quiere seguir jugando no entiende una pantalla de fin.

Al llenar el catálogo aparecieron dos fronteras de tema que `CONTEXT.md` no
resolvía sola. El barco se queda en `mar` porque el glosario dice "vive o flota
en el agua" y esa frase se escribió para él; la bicicleta se va a `vehiculos`
porque `deportes` son los objetos con los que se juega, no las cosas sobre las
que uno se sube. Ambas están anotadas en `piezas.ts`.
