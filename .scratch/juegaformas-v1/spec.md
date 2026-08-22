# Spec: JuegaFormas v1

Salida de la entrevista de `grill-with-docs`. El vocabulario que usa este
documento está definido en `CONTEXT.md`; la decisión de progresión, en
`docs/adr/0001-progresion-por-numero-de-piezas.md`.

## Objetivo

Un juego de puzzles para niños de 5 a 7 años que funciona sin conexión y que un
niño puede usar durante diez minutos sin que un adulto toque la pantalla.

Producto real, no maqueta: se publicará en GitHub Pages y más adelante se
empaquetará para Android e iOS. No lleva telemetría, así que **la retención es
un objetivo de diseño, no una métrica observable**.

## Alcance de la v1

Dentro:

- Las tres mecánicas: `encajar`, `emparejar` (con modo `boca abajo`) y `ordenar`
- **Un nivel por mecánica** — tres niveles, unas 50 partidas
- Los siete temas
- Castellano e inglés, ambos dentro del bundle
- Ajustes de adulto: idioma, volumen, reiniciar progreso

Fuera:

- Los niveles 2 y 3 de cada mecánica (la forma final son nueve niveles)
- Empaquetado nativo con Capacitor — pero la v1 se construye para no impedirlo
- Cuentas, nube, perfiles múltiples, telemetría, tiendas de aplicaciones
- Locución de voz

## Mecánicas

Las tres comparten el mismo esqueleto: se genera un tablero de N piezas de un
tema, el niño lo resuelve, hay celebración, siguiente partida.

- **Encajar**: el niño arrastra cada pieza hasta su hueco. Arrastre táctil con
  tolerancia generosa de encaje.
- **Emparejar**: el niño relaciona las piezas que van juntas. El modo
  `boca abajo` arranca con las piezas ocultas y las descubre al tocarlas.
- **Ordenar**: el niño coloca las piezas en una secuencia correcta. La lógica
  habla de "inicio" y "fin", no de izquierda y derecha.

## Progresión

- Un `nivel` es un bloque de 15-20 partidas con número de piezas fijo
- Cada mecánica tiene tres niveles; la v1 entrega el primero de cada una
- Lo único que se desbloquea es el nivel. Los siete temas están libres desde el
  primer arranque, en cualquier nivel
- El nivel no se elige: siempre se juega el más alto desbloqueado

## Flujo de pantallas

Dos toques hasta jugar, sin onboarding ni tutorial:

1. **Inicio**: tres iconos grandes, uno por mecánica. Sin texto.
2. **Temas**: una fila de temas, cada uno con una pieza de muestra.
3. **Partida**: el tablero.

El primer tablero es de tres piezas y se explica solo.

## Carácter

No existe el fracaso. Sin vidas, sin puntuación, sin temporizador.

- Al fallar, la pieza vuelve a su sitio **en silencio**, con una animación suave
- Tras varios intentos fallidos aparece una `pista`: señala el sitio correcto,
  nunca lo resuelve
- `Celebración` breve al completar una partida
- `Celebración` grande al completar un nivel

## Contenido y assets

- Piezas **originales, dibujadas como SVG** en un sistema de estilo cerrado:
  lienzo fijo, relleno plano sin degradados, contorno uniforme, paleta corta
- Ninguna dependencia CC-BY, por tanto **no hace falta pantalla de créditos**
- Kenney (CC0) solo para sonidos
- Los assets llevan `tema` y `nombre`, nada más: la única palanca de dificultad
  es el número de piezas
- Siete temas con fronteras que no se solapan: espacio, animales (tierra), mar,
  naturaleza, comida, deportes, vehículos

## Audio

- Música de fondo alegre, a volumen bajo
- Efectos **solo en los aciertos** y en las celebraciones
- Todo silenciable desde los ajustes

## Idiomas

Castellano principal, inglés incluido. Ambos catálogos dentro del bundle,
cargados por clave, de forma que un tercer idioma pueda ir bajo demanda el día
que pese de verdad.

## Técnico

- `HashRouter` y rutas relativas, para que la misma build valga en GitHub Pages
  y dentro de Capacitor sin tocar nada
- Orientación horizontal bloqueada
- Un solo perfil por dispositivo, en `localStorage`
- PWA que arranca entera sin conexión: precache de ilustraciones y sonidos
- Ajustes de adulto tras una barrera de pulsación larga, no un botón
- La lógica pura vive en `src/lib/` y es donde van los tests

## Criterios de aceptación

1. Un niño llega a jugar en dos toques desde el arranque
2. Las tres mecánicas son jugables con arrastre táctil en tablet horizontal
3. Completar 15-20 partidas de un nivel dispara la celebración grande
4. Fallar no produce sonido, ni resta nada, ni bloquea el avance
5. La pista aparece tras varios fallos y señala sin resolver
6. La aplicación arranca y es jugable en modo avión tras la primera visita
7. Cambiar de idioma en ajustes funciona sin conexión
8. Reiniciar el progreso desde ajustes deja el juego como recién instalado
