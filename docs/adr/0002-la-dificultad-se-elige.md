# La dificultad se elige, y se elige por mecánica

El número de piezas del tablero pasa a ser una **dificultad** elegible —`facil`,
`media`, `dificil`— y deja de colgar del nivel. Los tres botones viven en la
cabecera de la pantalla de temas de cada mecánica, y lo elegido se guarda.

Esto revisa la mitad de [0001](0001-progresion-por-numero-de-piezas.md): sigue
siendo cierto que el contenido no se desbloquea, pero el tamaño del tablero ya no
se desbloquea tampoco, se pide.

El motivo es que un niño concreto no cabe en una curva. A los cinco años se puede
encajar seis piezas de sobra y atascarse emparejando cuatro, y hacerle jugar
quince partidas de tres para «desbloquear» las de seis es aburrirle quince veces
para llegar a lo que ya sabía hacer. Al revés es peor: el que aún no llega no
tiene forma de bajar. Quien ve las dos cosas es el adulto que está sentado al
lado, y hasta ahora el juego no le daba dónde decirlo.

Es por mecánica y no una sola para todo el juego por lo mismo: bajarle las tres
de golpe a quien solo se atasca en una le quita lo que ya hacía bien.

## Alternativas descartadas

**Dificultad automática**, subiendo sola tras varios aciertos seguidos. Sin
telemetría no hay forma de comprobar si acierta, se equivoca en silencio y
mueve el suelo bajo los pies del niño en mitad de la sesión. Además le quita al
adulto lo único que puede decidir.

**En ajustes**, junto al idioma y el volumen. Habría que enseñar las tres
mecánicas a la vez y elegir a ciegas, sin el nombre de la mecánica delante; y a
ajustes se entra manteniendo pulsado, que es justo lo que no va a hacer quien
está mirando cómo se atasca el niño.

## Consecuencias

El nivel se queda solo con el ritmo de las celebraciones: `Nivel` ya no lleva
`piezas`. Cuántas piezas trae el tablero lo dice `PIEZAS_POR_DIFICULTAD` en
`src/lib/niveles.ts`, y el guardado lleva una dificultad por mecánica.

Las tres mecánicas tienen que caber con seis piezas en una tablet apaisada, así
que los tamaños dejan de ser clases fijas y se calculan: `--ficha` en `encajar`,
`--carta` en `emparejar` y el `em` de la escalera en `ordenar`. `ordenar` se
queda en cinco como máximo —su escalera crece con peldaños cada vez mayores, y el
sexto dejaría el primero del tamaño de una uña—.
