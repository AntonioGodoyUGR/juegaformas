import { DETALLE, PALETA } from './estilo'
import { Lienzo } from './lienzo'

/**
 * Una chispa de cuatro puntas: lo que hace que el cielo no sea un fondo liso y
 * lo que llevan las cartas por el dorso.
 *
 * No está en `DIBUJOS` a propósito. Aquellos son las cuarenta y dos piezas del
 * juego —cosas que se arrastran, se emparejan y se nombran en voz alta—; esta
 * no se toca nunca y no tiene nombre. Si entrara en el mapa acabaría saliendo
 * repartida en un tablero, y una chispa no es un cohete.
 *
 * Cuatro puntas y no cinco: la estrella de cinco ya es la de la celebración, y
 * el niño tiene que poder distinguir «lo que hay de fondo» de «lo que ha
 * conseguido» sin pensarlo.
 */
export function Chispa({ className }: { className?: string }) {
  return (
    <Lienzo className={className}>
      <path
        d="M128 34 L147 109 L222 128 L147 147 L128 222 L109 147 L34 128 L109 109 Z"
        fill={PALETA.blanco}
        strokeWidth={DETALLE}
      />
    </Lienzo>
  )
}
