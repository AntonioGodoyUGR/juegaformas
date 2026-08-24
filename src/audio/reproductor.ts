import { Howl, Howler } from 'howler'

/**
 * Lo que suena y quién lo hace sonar. Es la única parte del juego que toca
 * `howler`: el resto pide un efecto por su nombre y no sabe si detrás hay un
 * fichero, un silencio o un espía de un test.
 */

/**
 * Los tres únicos sonidos del juego, y los tres son buenas noticias. No hay
 * sonido de fallo: equivocarse aquí es parte de jugar —un niño de cinco años
 * prueba una pieza para ver si entra—, y ponerle un ruido encima convierte
 * probar en meter la pata.
 */
export type Efecto = 'acierto' | 'partida' | 'nivel'

export type Reproductor = {
  /** Suena una vez y no se puede parar: son todos más cortos que un parpadeo. */
  efecto: (cual: Efecto) => void
  /** Enciende o apaga la música de fondo. Idempotente: llamarlo dos veces no la duplica. */
  musica: (sonando: boolean) => void
  /** El volumen general, de 0 a 1. A cero no se oye nada, ni siquiera la música. */
  volumen: (cuanto: number) => void
}

/** Un reproductor que no reproduce. Es el que sale cuando nadie pone otro. */
export const MUDO: Reproductor = {
  efecto: () => {},
  musica: () => {},
  volumen: () => {},
}

/**
 * Dónde están los ficheros. Sale de `BASE_URL` y no de una ruta absoluta por lo
 * mismo que `base: './'` en la configuración de Vite: la misma build sirve en la
 * raíz de un dominio, en el subdirectorio de GitHub Pages y en el `file://` de
 * Capacitor.
 */
const CARPETA = `${import.meta.env.BASE_URL}sonidos/`

/**
 * Cuánto suena cada cosa respecto de las demás. La música va muy por debajo de
 * los efectos: acompaña, y lo que tiene que oírse por encima es la respuesta a
 * lo que el niño acaba de hacer.
 */
const MEZCLA = {
  musica: 0.3,
  acierto: 0.55,
  partida: 0.7,
  nivel: 0.8,
}

/**
 * La música va en dos formatos y los efectos en uno solo, y el motivo es el
 * bucle. Un MP3 lleva silencio de relleno al principio y al final que el
 * codificador no puede quitar, y ese silencio se oye como un tropiezo cada
 * vuelta; Vorbis no lo tiene. Como Vorbis no lo reproduce todo el mundo, el MP3
 * se queda de reserva: `howler` coge el primero que el navegador sepa tocar.
 */
const MUSICA = [`${CARPETA}musica.ogg`, `${CARPETA}musica.mp3`]

/**
 * El reproductor de verdad. Carga los cinco ficheros al construirse —son
 * doscientos y pico kilobytes en total y el juego tiene que sonar en modo
 * avión—, así que se construye una vez, al arrancar, y no cada vez que hay algo
 * que sonar.
 *
 * No hay forma de descargarlo. La página vive lo que vive la aplicación, y un
 * `unload()` en la limpieza de un efecto deja el juego mudo en cuanto React
 * monta dos veces en desarrollo.
 */
export function conHowler(): Reproductor {
  const efectos: Record<Efecto, Howl> = {
    acierto: new Howl({ src: [`${CARPETA}acierto.mp3`], volume: MEZCLA.acierto }),
    partida: new Howl({ src: [`${CARPETA}partida.mp3`], volume: MEZCLA.partida }),
    nivel: new Howl({ src: [`${CARPETA}nivel.mp3`], volume: MEZCLA.nivel }),
  }

  const fondo = new Howl({ src: MUSICA, loop: true, volume: MEZCLA.musica })

  return {
    efecto: (cual) => {
      efectos[cual].play()
    },

    musica: (sonando) => {
      // Parar y no bajar el volumen: una música inaudible que sigue sonando
      // gasta batería en una tablet y no se distingue de un silencio.
      if (sonando && !fondo.playing()) fondo.play()
      if (!sonando && fondo.playing()) fondo.pause()
    },

    volumen: (cuanto) => {
      Howler.volume(cuanto)
    },
  }
}
