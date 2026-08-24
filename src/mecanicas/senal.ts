/**
 * Cómo se ve una pista: un halo que late alrededor del sitio correcto.
 *
 * Es una sola constante y no una clase por mecánica porque la pista tiene que
 * verse igual en las tres. Un niño aprende una vez que «lo que late es donde
 * hay que ir»; si en cada tablero se señalara de otra manera, tendría que
 * aprenderlo tres veces, y justo cuando está atascado.
 *
 * Late en vez de estar fijo porque el movimiento es lo que se ve sin mirar, y
 * el color solo no vale: media docena de niños de cada cien no distinguen dos
 * tonos que a los demás nos parecen distintísimos.
 */
export const SENAL = 'animate-pulse ring-4 ring-purple-500'
