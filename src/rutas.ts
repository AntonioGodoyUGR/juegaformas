/**
 * Las rutas del juego, en un solo sitio, para que ninguna vista construya URLs
 * a mano. Van por `HashRouter`, así que lo que aparece en la barra de
 * direcciones es `#/espacio/mar` y la parte de ruta nunca cambia.
 *
 * Los parámetros son `string` de momento: los tipos del dominio y la validación
 * de los slugs llegan con el ticket 02.
 */
export const rutas = {
  inicio: '/',
  temas: (mecanica: string) => `/${mecanica}`,
  partida: (mecanica: string, tema: string) => `/${mecanica}/${tema}`,
} as const
