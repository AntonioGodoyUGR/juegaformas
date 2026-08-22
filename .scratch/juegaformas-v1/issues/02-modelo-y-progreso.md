# Modelo de dominio y progreso en localStorage

Status: ready-for-agent
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
