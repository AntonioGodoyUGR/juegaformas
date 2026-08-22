# JuegaFormas

Juego de puzzles para niños de 5 a 7 años, jugable sin conexión. Este glosario
fija el vocabulario del dominio: cómo se llaman las cosas del juego, no cómo
están implementadas.

## Mecánicas

**Mecánica**:
Una de las tres formas de jugar que ofrece el juego: encajar, emparejar u ordenar.
_Avoid_: modo, minijuego, tipo de puzzle

**Encajar**:
Mecánica en la que el niño arrastra una pieza hasta el hueco que le corresponde.
_Avoid_: arrastrar, drag and drop, puzzle

**Emparejar**:
Mecánica en la que el niño relaciona piezas que van juntas. Unifica lo que antes
se nombraba por separado como "parejas" y "memoria": son la misma mecánica.
_Avoid_: parejas, memoria, matching

**Boca abajo**:
Modo de `emparejar` en el que las piezas empiezan ocultas y el niño las descubre
al tocarlas. Es un modo de la mecánica, no una mecánica aparte.
_Avoid_: memoria, memory, cartas

**Ordenar**:
Mecánica en la que el niño coloca varias piezas en una secuencia correcta.
_Avoid_: secuenciar, clasificar, seriación

## Estructura del juego

**Partida**:
Un tablero completado. Es la unidad de juego y de progreso: no hay puntuación,
vidas ni tiempo, solo tableros terminados.
_Avoid_: ronda, sesión, intento, pantalla, juego

**Nivel**:
Un bloque de 15 a 20 partidas jugadas con un número de piezas fijo. Cada mecánica
tiene tres niveles, y es lo único que se desbloquea jugando.
_Avoid_: fase, mundo, dificultad, etapa

**Celebración**:
El premio visual al terminar. Hay dos: una breve al completar una partida, y una
grande al completar un nivel.
_Avoid_: recompensa, premio, victoria

**Pista**:
La señal visual que marca el sitio correcto cuando el niño lleva varios intentos
fallidos. Señala, nunca resuelve por él.
_Avoid_: ayuda, solución, truco

## Contenido

**Pieza**:
El objeto ilustrado que el niño manipula: un cohete, un pulpo, una manzana.
_Avoid_: ficha, carta, tile, item

**Tema**:
El mundo del que salen las piezas de una partida. Es piel: no lleva dificultad
encima y todos están disponibles desde el principio, en cualquier nivel.
_Avoid_: mundo, colección, set, categoría

Los siete temas, con fronteras que no se solapan:

- **espacio**: cohete, planeta, estrella, luna…
- **animales**: los de tierra
- **mar**: todo lo que vive o flota en el agua
- **naturaleza**: plantas, clima y paisaje
- **comida**
- **deportes**
- **vehículos**
