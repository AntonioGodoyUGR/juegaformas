# Inicio y elección de tema

Status: done
Blocked by: 02, 03, 04

Dos toques hasta jugar. Sin onboarding, sin tutorial, sin pantalla de carga.

## Alcance

- Inicio: tres iconos grandes, uno por mecánica
- Temas: los siete, cada uno con una pieza de muestra. Todos disponibles siempre
- El nivel no se elige nunca: se entra al más alto desbloqueado
- Objetivos táctiles grandes, todo horizontal

## Hecho cuando

- Desde el arranque en frío se está jugando en dos toques
- Ningún tema muestra candado

## Comments

Cerrado. Los dos toques son `Inicio` → `Temas` → `Partida`, y el test
`navegacion.test.tsx` los prueba como los da un niño —tocar «Encajar», tocar
«Espacio», estar en el tablero— y no por lo que renderiza cada vista.

**Los iconos de mecánica no son piezas.** Van en `src/iconos/mecanicas.tsx` y
fuera de `DIBUJOS`: el registro de piezas tiene un test que exige que toda clave
suya exista en el catálogo de `src/lib/piezas.ts`, y «encajar» no es un tema.
Pero sí comparten sistema de estilo, así que el envoltorio SVG —`viewBox`,
grosor, color de trazo, `non-scaling-stroke`— se ha sacado de `<Pieza>` a
`src/piezas/lienzo.tsx`. Era la única forma de que los tres iconos y las 42
piezas, que salen juntos en pantalla con dos segundos de diferencia, no se
separen la próxima vez que alguien toque el grosor.

Cada icono **enseña** la mecánica en vez de simbolizarla: encajar es una estrella
cayendo hacia su hueco, emparejar son dos cartas con lo mismo dentro, ordenar son
tres barras de tamaño creciente sobre un suelo. Con cinco años no se lee
«Emparejar»; el dibujo es lo que decide adónde va el dedo y la palabra está para
el adulto. Por eso los iconos son siempre decorativos: el enlace ya se llama como
la mecánica, y anunciarlo dos veces solo lo alarga.

Lo mismo en `Temas`, con `muestraDe(tema)`, que devuelve **siempre** la misma
pieza del tema. Deliberado: quien elige por el dibujo necesita que el dibujo no
cambie entre visitas, o el tema deja de ser reconocible. La muestra también va
decorativa, para que la casilla se anuncie «Espacio» y no «Cohete, Espacio».

Ningún candado y ningún nivel en pantalla, como pedía el ticket: el tema es piel,
no dificultad, y lo que se desbloquea jugando es el nivel, que no se elige. Y
tampoco hay progreso a la vista —ni barra, ni «continuar»—: enseñarlo solo sirve
para que el niño se compare consigo mismo, y además pondría un paso entre abrir
el juego y jugar.

**Añadido fuera del alcance literal: `Volver`.** El juego se instala como
aplicación, así que en la tablet no hay botón de atrás del navegador. Sin esto,
un niño que entra en la mecánica equivocada se queda dentro. Va arriba a la
izquierda, lejos de donde se juega, grande igual que todo pero gris: lo que tiene
que llamar la atención son los temas.

`rutas` pasa a llevar los parámetros tipados: es el primer ticket en el que las
vistas construyen estas URLs, y así una pantalla no puede enlazar a una mecánica
o un tema que no existen. Las URLs inventadas siguen cubiertas —vuelven al
inicio, nunca a una pantalla de error—, pero sus tests las escriben a mano
(`'/bailar'`), porque ya no se pueden construir con `rutas`.

Verificado a ojo a 1024×768, que es la tablet apaisada de referencia. La ventana
de Chrome estaba al 70% de zoom (`innerWidth` 1681 con `outerWidth` 1180), así
que medir sobre la captura engañaba; el tamaño real se comprobó contra el DOM y
encajonando `#root` en 1024×768. Ahí `Inicio` da tres tarjetas de 288px y
`Temas` reparte los siete en 4+3 con casillas de 192px, sin scroll en ninguna.
El ancho de la rejilla de temas está topado a propósito para forzar ese 4+3: los
siete en una sola fila salían por debajo del tamaño de un dedo de cinco años.
