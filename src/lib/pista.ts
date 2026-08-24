/**
 * La pista: qué cuenta como estar atascado y a qué se señala cuando lo estás.
 *
 * Vive aparte de las tres mecánicas porque las tres la usan y porque la regla
 * que importa —«señala, nunca resuelve por él»— se cumple sobre todo aquí, en
 * lo que este fichero *no* hace: no coloca nada, no toca el tablero y no sabe
 * jugar. Lo único que sabe es contar fallos seguidos y recordar un destino.
 *
 * Cada mecánica dice qué es fallar y qué destino se señala; cuántos fallos
 * hacen falta y que un acierto lo borra se deciden una sola vez, aquí.
 */

/**
 * Cuántos fallos seguidos hacen falta para que aparezca la pista.
 *
 * Tres y no uno: fallar una vez es normal y una pista inmediata convierte el
 * juego en seguir luces. Tres y no diez: un niño de cinco años abandona antes
 * de llegar a diez. Se cuentan seguidos, así que tres son tres sin acertar nada
 * en medio, que es la definición razonable de atasco.
 */
export const FALLOS_PARA_PISTA = 3

export type Pista = {
  /** Fallos seguidos desde el último acierto. */
  readonly fallos: number
  /**
   * A dónde señalaría la pista: el hueco, el sitio o la carta que la mecánica
   * dio en el último fallo. Es `null` cuando el fallo no traía destino, que es
   * el caso de `emparejar`: allí el destino no se sabe al fallar sino cuando el
   * niño vuelve a levantar una carta.
   */
  readonly destino: string | null
}

export const SIN_PISTA: Pista = { fallos: 0, destino: null }

/**
 * Cuenta un fallo. El destino es opcional porque no todas las mecánicas lo
 * conocen en ese momento; el que se pasa es siempre el del último intento, de
 * modo que la pista sigue al niño si cambia de pieza en vez de quedarse clavada
 * en la primera que probó.
 */
export function fallar(pista: Pista, destino: string | null = null): Pista {
  return { fallos: pista.fallos + 1, destino }
}

/** Un acierto borra la cuenta: el atasco se mide desde el último acierto. */
export function acertar(pista: Pista): Pista {
  return pista.fallos === 0 ? pista : SIN_PISTA
}

/** Si el niño lleva suficientes fallos seguidos como para merecer una mano. */
export function hayPista(pista: Pista): boolean {
  return pista.fallos >= FALLOS_PARA_PISTA
}

/** Si este destino concreto es el que la pista está señalando ahora mismo. */
export function estaSenalado(pista: Pista, destino: string): boolean {
  return hayPista(pista) && pista.destino === destino
}
