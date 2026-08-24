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
  /**
   * Cómo se llama una carta que todavía está boca abajo. Es el único texto propio
   * de la mecánica `emparejar`: el nombre de la pieza ya está en `piezas`, y
   * ponerlo aquí sería contarle el juego a quien no mira la pantalla.
   */
  readonly cartaTapada: string
  /**
   * Cómo se cuenta una secuencia de `ordenar`. Es el único sitio del catálogo
   * con funciones dentro, y el motivo es la gramática: «Cohete, tamaño 2 de 3»
   * no se monta pegando trozos traducidos por separado, porque cada idioma
   * coloca el número y la palabra donde quiere. Con una función, cada idioma
   * escribe su frase entera.
   */
  readonly orden: Orden
  /**
   * Cómo se dice una pista en voz alta. La pista es sobre todo visual —un
   * destello sobre el sitio correcto—, y un destello no se oye: sin esto, un
   * niño que juega con lector de pantalla sería el único que no sale del
   * atasco.
   */
  readonly pista: Pistas
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
 * Los textos de `ordenar`. Van con nombre de pieza y números dentro porque
 * describen algo que se ve —una pieza más grande, o tres piezas en vez de una— y
 * sin decir cuánto no se distinguen unas de otras.
 */
export type Orden = {
  /** Qué hay que hacer con la secuencia. Cambia con el criterio: es lo único que cambia. */
  readonly instrucciones: Readonly<Record<'tamano' | 'cantidad', string>>
  /** Un eslabón del criterio `tamano`: la pieza, su grado y cuántos hay. */
  readonly tamano: (pieza: string, grado: number, total: number) => string
  /** Un eslabón del criterio `cantidad`: la pieza y cuántas se ven. */
  readonly cantidad: (pieza: string, cuantas: number) => string
  /** Un sitio vacío de la secuencia. */
  readonly sitio: (sitio: number, total: number) => string
}

/**
 * Lo que se añade al nombre de algo cuando la pista lo señala. Se compone con
 * el nombre en vez de sustituirlo porque la pista no cambia lo que la cosa es:
 * un sitio de la secuencia sigue siendo el sitio dos de tres, y ahora además
 * está señalado.
 */
export type Pistas = {
  /** El hueco o el sitio donde va lo que el niño está intentando colocar. */
  readonly destino: (nombre: string) => string
  /** La carta que hace pareja con la que acaba de levantar. */
  readonly pareja: (nombre: string) => string
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
