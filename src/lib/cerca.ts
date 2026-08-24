/**
 * «Cerca es suficiente»: la geometría de soltar una pieza y que cuente.
 *
 * Vive aparte de las mecánicas porque la usan dos —`encajar` la estrena y
 * `ordenar` la hereda— y porque tiene un número dentro. Un número que decide si
 * un niño de cinco años acierta o falla tiene que poder probarse sin montar un
 * navegador.
 */

/** Un rectángulo en coordenadas de pantalla, con el origen arriba a la izquierda. */
export type Recuadro = {
  readonly x: number
  readonly y: number
  readonly ancho: number
  readonly alto: number
}

/** Un hueco del tablero con el sitio que ocupa en pantalla. */
export type Diana = {
  readonly id: string
  readonly recuadro: Recuadro
}

/**
 * Cuánto se le perdona al niño, en proporción al tamaño del hueco. A 0.6, una
 * pieza que se queda a más de media casilla de distancia no cuenta.
 *
 * Va en proporción y no en píxeles a propósito: el mismo tablero se juega en
 * una tablet de 10 pulgadas y en la ventana de un portátil, y la puntería de un
 * dedo de cinco años se mide en anchos de casilla, no en píxeles.
 */
export const TOLERANCIA = 0.6

/** La separación entre dos recuadros. Cero si se tocan o se solapan. */
function separacion(a: Recuadro, b: Recuadro): number {
  const dx = Math.max(0, a.x - (b.x + b.ancho), b.x - (a.x + a.ancho))
  const dy = Math.max(0, a.y - (b.y + b.alto), b.y - (a.y + a.alto))
  return Math.hypot(dx, dy)
}

function distanciaDeCentros(a: Recuadro, b: Recuadro): number {
  return Math.hypot(a.x + a.ancho / 2 - (b.x + b.ancho / 2), a.y + a.alto / 2 - (b.y + b.alto / 2))
}

/**
 * El hueco al que va una pieza soltada, o `null` si se ha soltado lejos de
 * todos.
 *
 * Vale con acercarse: un hueco entra en el sorteo si la pieza lo solapa o si se
 * queda a menos de `TOLERANCIA` de él. Entre los que entran gana el de centro
 * más cercano, para que soltar entre dos huecos pegados no sea una moneda al
 * aire.
 *
 * Que devuelva `null` es lo que mantiene el fallo posible. Sin ese caso, la
 * pieza siempre encontraría hueco y la mecánica se resolvería sola.
 */
export function huecoMasCercano(arrastrada: Recuadro, huecos: readonly Diana[]): string | null {
  let elegido: string | null = null
  let mejor = Infinity

  for (const hueco of huecos) {
    const margen = Math.min(hueco.recuadro.ancho, hueco.recuadro.alto) * TOLERANCIA
    if (separacion(arrastrada, hueco.recuadro) > margen) continue

    const distancia = distanciaDeCentros(arrastrada, hueco.recuadro)
    if (distancia < mejor) {
      mejor = distancia
      elegido = hueco.id
    }
  }

  return elegido
}
