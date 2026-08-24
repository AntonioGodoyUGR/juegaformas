# Mecánica: encajar

Status: done
Blocked by: 02, 03, 05

El niño arrastra cada pieza hasta su hueco.

## Alcance

- Arrastre táctil con `@dnd-kit/core`
- Tolerancia de encaje generosa: cerca es suficiente
- Al fallar, la pieza vuelve a su sitio con una animación suave y en silencio
- Tablero terminado cuando todas las piezas están encajadas

## Hecho cuando

- Funciona con el dedo en tablet horizontal, no solo con ratón
- Fallar no resta, no bloquea y no suena

## Comments

Cerrado. Las reglas están en `src/lib/encajar.ts` **sin React y sin
`@dnd-kit`**, y la vista `src/mecanicas/Encajar.tsx` solo traduce dedos a
llamadas de allí. El motivo es la tolerancia: «cerca es suficiente» es una regla
de geometría con un número dentro, y un número que decide si un niño de cinco
años acierta o falla tiene que poder probarse sin montar un navegador.

**La tolerancia va en proporción, no en píxeles**: `TOLERANCIA = 0.6` del lado
menor del hueco. El mismo tablero se juega en una tablet de diez pulgadas y en
la ventana de un portátil, y la puntería de un dedo se mide en anchos de
casilla. Un hueco entra en el sorteo si la pieza lo solapa o si se queda a menos
de ese margen; entre los que entran gana el de centro más cercano, para que
soltar entre dos huecos pegados no sea una moneda al aire. Que `huecoMasCercano`
pueda devolver `null` es lo que mantiene el fallo posible: sin ese caso la pieza
siempre encontraría sitio y la mecánica se resolvería sola.

**Fallar no hace nada.** `soltar` devuelve el mismo objeto tablero, así que la
vista ni siquiera repinta; la pieza vuelve a su sitio con la animación de
`@dnd-kit` y no hay sonido, ni mensaje, ni intentos contados. Hay un test que
falla veinte veces seguidas y comprueba que el tablero sigue igual de jugable, y
otro en la vista que comprueba que después de fallar no aparece nada nuevo en
pantalla.

Tres decisiones de tablero que no estaban en el ticket:

- **Un hueco lleno sale del sorteo** (`useDroppable({ disabled })`), para que una
  pieza soltada entre dos vaya al que de verdad puede recibirla.
- **La bandeja no se recoloca al acertar**: la ficha encajada deja un sitio
  vacío. Si la fila se recompone, la pieza que el niño iba a coger a
  continuación se le mueve debajo del dedo.
- **El hueco vacío enseña la pieza en color de sombra**, con un filtro sobre el
  mismo dibujo en vez de con 42 siluetas duplicadas: dos versiones de cada pieza
  se desincronizan el día que alguien retoca una, y un filtro no puede.

Sobre nombres: el hueco vacío es decorativo —la ficha que va en él ya está en la
bandeja con su nombre— y el hueco lleno sí nombra la pieza, porque para entonces
la ficha ha desaparecido. Y `@dnd-kit` anuncia el arrastre con frases de fábrica
**en inglés**, que en un juego en castellano se oyen en cuanto se coge una
pieza; están traducidas en los dos catálogos bajo `textos.arrastre`, con un test
que se queja si falta alguna.

Ocho píxeles de margen antes de considerar que esto es un arrastre: un dedo que
solo toca —y un dedo de cinco años nunca toca del todo quieto— levantaría la
pieza y la soltaría en el sitio, que se ve como un parpadeo. Y `touch-none` en
la ficha es obligatorio, no estético: sin él el navegador se queda el gesto para
hacer scroll y la pieza no se mueve con el dedo.

`Partida` gana un componente `Ronda` interior: **el juego no tiene pantalla de
fin**, al terminar un tablero se anota la partida y se reparte otro tras una
pausa de 900 ms. La pausa es para que la última pieza encajada no desaparezca en
el mismo gesto; lo que la llenará es la celebración del ticket 10.

Lo que costó los tests de la vista: con un `DragOverlay` montado, `@dnd-kit`
mide **la capa de vuelo**, no la ficha, y jsdom no maqueta. Por eso las medidas
se ponen con un espía sobre `Element.prototype.getBoundingClientRect` respaldado
por un `WeakMap`, y lo que no se ha colocado a mano —la capa, que `@dnd-kit`
crea al empezar— se queda en el origen; de ahí que los arrastres se cuenten
desde (0, 0). También hizo falta un `ResizeObserver` de mentira en el setup.

**Pendiente de comprobar a ojo.** «Funciona con el dedo en tablet horizontal» no
se ha verificado en pantalla: la extensión de Chrome no está conectada en esta
sesión, así que no hubo navegador. Lo que sí está probado es todo lo demás, con
diez tests de vista que arrastran de verdad. Sobre el papel el tablero cabe
—tres huecos de 144 px con 32 de separación son 496 de ancho, y las dos filas
más la cabecera no llegan a 500 de alto sobre los 768 de la tablet de
referencia—, pero eso es aritmética, no una captura.
