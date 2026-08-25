import { Mascota } from '../piezas/mascota'

/**
 * La mascota dentro del tablero. Está siempre, en la esquina de abajo a la
 * izquierda, y hace una sola cosa: cuando la pista aparece, señala.
 *
 * Es la mitad de la pista que se entiende sin haber aprendido nada. La otra
 * mitad —el halo que late alrededor del sitio, en `src/mecanicas/senal.ts`—
 * dice *dónde*; esta dice *que hay algo que mirar*. Un niño que no sabe leer y
 * no está mirando el hueco correcto ve moverse a la criatura antes que ver
 * latir un borde, porque la criatura es lo único con cara que hay en pantalla.
 *
 * No lleva nombre accesible ni recibe el foco: para quien usa lector de
 * pantalla, la palabra que hace falta —«Aquí va»— ya la dice el hueco
 * señalado, y repetirla aquí la diría dos veces y en el orden equivocado.
 *
 * Va en la esquina de abajo a la izquierda porque las tres mecánicas centran su
 * tablero: lo que sobra siempre son los bordes.
 */
export function Guia({ senalando }: { senalando: boolean }) {
  return (
    <Mascota
      pose={senalando ? 'senala' : 'reposo'}
      className="pointer-events-none absolute bottom-1 left-1 w-20 sm:w-28"
    />
  )
}
