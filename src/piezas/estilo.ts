/**
 * El sistema de estilo de las piezas. Es cerrado a propósito: cuantas menos
 * decisiones queden abiertas, más se parecen entre sí cuarenta y dos dibujos
 * hechos en sesiones distintas.
 *
 * Las reglas:
 *
 * - Lienzo cuadrado de 256, siempre. La pieza vive dentro de un margen de 24
 *   para que el trazo no se coma en los bordes al escalarla.
 * - Relleno plano. Ningún degradado, ninguna sombra difuminada, ninguna
 *   transparencia. El volumen se dibuja con manchas de color, no con blur.
 * - Dos grosores y un solo color de trazo, con esquinas y puntas redondeadas:
 *   `GROSOR` para la silueta y `DETALLE` para lo de dentro. Es lo que hace que
 *   un cohete y una manzana parezcan del mismo juego.
 * - Seis colores y blanco, cada uno con exactamente una sombra. No hay tercer
 *   tono: si un dibujo necesita tres tonos del mismo color, el dibujo está mal
 *   planteado, no la paleta.
 *
 * La luz viene siempre de arriba a la izquierda, así que la sombra cae abajo a
 * la derecha. Da igual que sea una manzana o un planeta.
 *
 * Las piezas se leen a 96px de lado en una tablet. La silueta y las manchas
 * grandes no bajan de unos 16 de lienzo; el detalle interior puede llegar a
 * unos 10, porque va apoyado en una forma que ya se entiende sin él.
 */

export const LIENZO = 256

/** Contorno de la silueta. */
export const GROSOR = 8

/** Líneas y rasgos de dentro: costuras, radios, vetas, párpados. */
export const DETALLE = 5

export const TRAZO = '#2f2a3d'

export const PALETA = {
  rojo: '#ef4757',
  naranja: '#ff9f43',
  amarillo: '#ffd93d',
  verde: '#35c46b',
  azul: '#3d8bfd',
  morado: '#a259e6',
  blanco: '#ffffff',
} as const

/**
 * La cara en sombra de cada color. Se usa como relleno plano, normalmente
 * debajo del color claro: se dibuja la forma entera en sombra y encima la misma
 * forma desplazada hacia la luz, así el recorte sale limpio sin `clipPath`.
 *
 * `blanco` incluido: una nube o un casco también tienen cara oscura, y en gris
 * neutro se vería sucio al lado de una paleta tan saturada.
 */
export const SOMBRA = {
  rojo: '#c62c47',
  naranja: '#e07a1e',
  amarillo: '#e8b41c',
  verde: '#22a055',
  azul: '#2a68d1',
  morado: '#8340c4',
  blanco: '#e2ddec',
} as const

export type Color = (typeof PALETA)[keyof typeof PALETA] | (typeof SOMBRA)[keyof typeof SOMBRA]
