# Música y efectos

Status: done
Blocked by: 10

## Alcance

- Música de fondo alegre y a volumen bajo, en bucle
- Efectos solo en los aciertos y en las celebraciones. El fallo es silencioso
- Silenciable por completo desde ajustes, y el silencio persiste
- `howler` para la reproducción; sonidos CC0, precargados

## Hecho cuando

- Con el volumen a cero el juego es plenamente jugable
- Ningún sonido se dispara al fallar

## Comments

Hecho. Una interfaz, `Reproductor`, con tres verbos —`efecto`, `musica`,
`volumen`— y una sola implementacion que toca `howler` (`src/audio/reproductor.ts`).
El resto del juego pide `sonar('acierto')` y no sabe si detras hay un fichero, un
silencio o un test mirando.

Sin proveedor no suena nada: el contexto trae `MUDO` por defecto. Eso es lo que
deja que los once ficheros de test que ya montaban `App` sigan como estaban, sin
enterarse de que el juego tiene sonido, y es tambien lo que hace que el sonido sea
de verdad quitable: se borra `ProveedorDeAudio` de `main.tsx` y el juego sigue.

**Los sonidos no son CC0 descargados, son sintetizados aqui.** El alcance pedia un
banco de sonidos; bajar cinco ficheros de audio de internet significa descargar de
fuentes que no controlamos y quedarse con una licencia que hay que comprobar a mano
—y volver a comprobar el dia que uno cambie—. `herramientas/generar-sonidos.py`
los escribe con senos y envolventes usando solo la libreria estandar, y ffmpeg para
comprimir. Se ejecuta a mano, no en la build. Lo que hay en el repositorio se ha
escrito en el repositorio, y la procedencia de cada nota esta en el script.

La musica va en ogg con mp3 de reserva y los efectos solo en mp3, y el motivo es el
bucle: el MP3 lleva relleno de silencio que el codificador no puede quitar y se oye
como un tropiezo cada vuelta. Para una musica de fondo eso importa; para un pin de
tres decimas, no.

Dos cosas que no son obvias y estan puestas a proposito:

- La musica no arranca sola. Los navegadores no dejan que una pagina empiece a
  sonar sin que nadie la haya tocado, y la que lo intenta se queda muda sin poder
  saberlo. Se espera al primer `pointerdown` o `keydown`, que llega enseguida
  porque para jugar hay que elegir mecanica.
- Volumen cero **para** la musica, no la baja. Una musica inaudible que sigue
  sonando gasta bateria en una tablet y no se distingue de un silencio.

El sonido de las celebraciones vive dentro de `Celebracion.tsx` y no en quien las
monta: asi no hay forma de que salgan las estrellas sin que suene nada. Y no hay
sonido de fallo, que era el punto del alcance: un nino de cinco anos prueba una
pieza para ver si entra, y ponerle un ruido encima convierte probar en equivocarse.

**El control para silenciar es del ticket 12.** Aqui esta el volumen leyendose del
guardado —donde vive desde el 02— y todo lo que cuelga de el; lo que falta es la
pantalla de ajustes que lo cambie.

`src/estado/audio.test.tsx` prueba con un reproductor espia las dos condiciones de
hecho —el juego entero se termina con el volumen a cero, y fallar no dispara nada—
mas cuando suena cada efecto.

Verificado: `npm run typecheck`, `npx vitest run` (19 ficheros, 221 tests) y
`npm run build`, todo en verde. El precache pasa de 347 KiB a 649 KiB con los cinco
ficheros de audio dentro; el presupuesto se revisa en el ticket 13. **Sin comprobar
a oido**, igual que los tickets anteriores: no hay navegador conectado en esta
sesion, asi que lo que se ha verificado es cuando se pide cada sonido, no como
suena.
