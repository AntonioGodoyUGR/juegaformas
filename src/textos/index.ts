import { type Mecanica, type Tema } from '../lib/dominio'
import { type Idioma } from '../lib/progreso'
import { en } from './en'
import { es } from './es'

/**
 * Todo lo que el juego escribe, agrupado por idioma. Ninguna vista escribe una
 * palabra a mano: lo que se ve sale siempre de aquí.
 */
export type Textos = {
  /** El nombre del juego no se traduce, pero vive aquí para que nadie lo teclee dos veces. */
  readonly nombre: string
  /** Volver a la pantalla anterior. Es el único texto de navegación del juego. */
  readonly volver: string
  readonly mecanicas: Readonly<Record<Mecanica, string>>
  readonly temas: Readonly<Record<Tema, string>>
  /**
   * Por identificador de pieza, `tema/nombre`. Es el nombre accesible del
   * dibujo: sin él, cuarenta y dos ilustraciones son cuarenta y dos silencios
   * para un lector de pantalla. Un test comprueba que no falta ninguna.
   */
  readonly piezas: Readonly<Record<string, string>>
  /**
   * Lo que oye quien juega con lector de pantalla mientras arrastra. `@dnd-kit`
   * trae sus propios anuncios, pero en inglés: sin esto, un juego en castellano
   * empieza a hablar en inglés en cuanto se coge una pieza.
   */
  readonly arrastre: Arrastre
}

/** Los anuncios del arrastre. Frases sueltas, sin nombre de pieza dentro: el
 * lector acaba de leer la ficha que se ha cogido y repetirlo solo alarga. */
export type Arrastre = {
  readonly instrucciones: string
  readonly cogida: string
  readonly sobreHueco: string
  readonly fueraDeHueco: string
  readonly encajada: string
  readonly devuelta: string
}

/**
 * Los dos idiomas van dentro del bundle: son dos ficheros de texto y el juego
 * tiene que arrancar sin conexión, así que descargarlos aparte solo añadiría una
 * forma de fallar.
 *
 * El día que un tercer idioma pese lo suficiente para no meterlo, el cambio es
 * local a `textosDe`: el valor del registro pasa a ser una promesa y esta
 * función la resuelve. Nadie más conoce el registro.
 */
const CATALOGOS: Readonly<Record<Idioma, Textos>> = { es, en }

export function textosDe(idioma: Idioma): Textos {
  return CATALOGOS[idioma]
}

/**
 * Cada idioma escrito en su propio idioma. En un selector, quien busca inglés
 * busca «English», no «Inglés»; y quien lo abre sin querer con la aplicación en
 * inglés reconoce «Castellano» para volver.
 */
export const NOMBRES_DE_IDIOMA: Readonly<Record<Idioma, string>> = {
  es: 'Castellano',
  en: 'English',
}
