import { useNavigate } from 'react-router-dom'
import { useTextos } from '../estado/juego'
import { TRAZO } from '../piezas/estilo'
import { rutas } from '../rutas'
import { usePulsacionLarga } from './pulsacionLarga'

/**
 * La puerta de los ajustes, en la esquina de la pantalla de inicio y solo ahí.
 * No está dentro del juego a propósito: lo que se cambia aquí —el idioma, el
 * volumen, borrarlo todo— no es de la partida, y un adulto que quiera tocarlo
 * puede salir al inicio en dos toques.
 *
 * Gris y pequeña, como el botón de volver: en esta pantalla lo que tiene que
 * llamar la atención son las tres mecánicas.
 */
export function EsquinaDeAjustes() {
  const textos = useTextos()
  const navegar = useNavigate()
  const mantener = usePulsacionLarga(() => navegar(rutas.ajustes))

  return (
    <button
      type="button"
      // El nombre dice cómo se abre. Un botón que no responde al toque y no
      // explica por qué es un botón roto para quien no ve la pantalla.
      aria-label={textos.ajustes.abrir}
      className="absolute top-4 right-4 flex size-12 items-center justify-center rounded-full text-purple-300 transition-transform active:scale-90"
      {...mantener}
    >
      <Engranaje />
    </button>
  )
}

/**
 * Un engranaje de línea, en el estilo del botón de volver y no en el de las
 * piezas: esto es de los adultos, y los dibujos de colores son del juego.
 */
function Engranaje() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke={TRAZO}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.45}
    >
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.6 L12 5.2 M12 18.8 L12 21.4 M21.4 12 L18.8 12 M5.2 12 L2.6 12 M18.6 5.4 L16.8 7.2 M7.2 16.8 L5.4 18.6 M18.6 18.6 L16.8 16.8 M7.2 7.2 L5.4 5.4" />
    </svg>
  )
}
