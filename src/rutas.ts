import { type Mecanica, type Tema } from './lib/dominio'

/**
 * Las rutas del juego, en un solo sitio, para que ninguna vista construya URLs
 * a mano. Van por `HashRouter`, así que lo que aparece en la barra de
 * direcciones es `#/espacio/mar` y la parte de ruta nunca cambia.
 *
 * Los parámetros van tipados: una pantalla solo puede enlazar a una mecánica y
 * un tema que existen. Las URLs inventadas —las que teclea alguien a mano— no
 * se construyen aquí, se validan al leerlas en la vista.
 */
export const rutas = {
  inicio: '/',
  temas: (mecanica: Mecanica) => `/${mecanica}`,
  partida: (mecanica: Mecanica, tema: Tema) => `/${mecanica}/${tema}`,
} as const
