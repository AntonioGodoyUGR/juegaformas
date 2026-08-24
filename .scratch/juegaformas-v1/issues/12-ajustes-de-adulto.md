# Ajustes tras pulsación larga

Status: done
Blocked by: 04, 11

Mínimos, y detrás de una barrera que un niño de cinco años no cruza sin querer.

## Alcance

- Acceso por pulsación larga, no por botón
- Tres controles: idioma, volumen y reiniciar progreso
- Reiniciar pide confirmación
- Un solo perfil por dispositivo: no hay selección de perfil

## Hecho cuando

- Un toque normal en la esquina de ajustes no abre nada
- Reiniciar deja el juego como recién instalado

## Comments

Hecho. La puerta es un engranaje gris en la esquina de arriba a la derecha del
inicio, y solo del inicio: lo que se toca aqui no es de la partida, y un adulto
sale al inicio en dos toques desde cualquier sitio.

La barrera es `usePulsacionLarga` (`src/componentes/pulsacionLarga.ts`), 800 ms.
No devuelve un componente sino los manejadores, y eso no es un detalle: el boton
**no tiene `onClick`**, asi que no hay forma de que un toque abra nada. Tres cosas
que costaron mas de lo que parecen:

- El boton se llama «Ajustes. Manten pulsado para abrir». Un boton que no responde
  al toque y no dice por que esta roto para quien no ve la pantalla.
- Con teclado se aguanta la tecla igual que el dedo, y las repeticiones del
  teclado se ignoran: sin eso, cada repeticion reiniciaba la cuenta y la barrera
  era imposible de cruzar tecleando.
- `onContextMenu` cancelado. Mantener el dedo en un movil saca el menu del sistema
  encima, y la barrera se convertia en «copiar imagen».

Tres controles y ninguno mas. Idioma con los dos nombres escritos cada uno en su
idioma —quien lo abre sin querer con el juego en ingles reconoce «Castellano» para
volver—, volumen de diez en diez con el cero diciendo «Sin sonido» en vez de «0 %»,
y borrar el progreso en dos pasos donde el primero no borra: enseña que se pierde.
La confirmacion es de la pantalla y no un `confirm()` del navegador, que no se
traduce, no se lee bien con lector de pantalla y en una aplicacion instalada sale
con el nombre del dominio encima. El foco va a Cancelar.

Reiniciar de verdad deja el aparato como recien instalado, y por eso
`reiniciar()` de `progreso.ts` ahora recibe el idioma: se vuelve al del aparato, no
al que eligio una vez un adulto que ya no esta. Despues se navega al inicio, que es
donde empieza un juego nuevo.

Sin perfiles, como pedia el alcance. El progreso es de la tablet y no de una
persona: elegir perfil seria un paso mas antes de jugar y una pregunta —«¿quien
eres?»— que a los cinco años se contesta tocando el primer boton.

`src/vistas/ajustes.test.tsx` prueba las dos condiciones de hecho por separado: que
el toque, el toque corto y el dedo que se desliza fuera no abren nada, y que
confirmar el borrado deja el guardado exactamente igual a `porDefecto`.

Verificado: `npm run typecheck`, `npx vitest run` (20 ficheros, 231 tests) y
`npm run build`, todo en verde. **Sin comprobar a ojo**: no hay navegador conectado
en esta sesion, asi que los 800 ms estan elegidos a ojo de leer, no de aguantar el
dedo.
