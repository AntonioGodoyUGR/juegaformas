import { Link } from 'react-router-dom'
import { useTextos } from '../estado/juego'
import { TRAZO } from '../piezas/estilo'

/**
 * La salida de una pantalla. El juego se instala como aplicación, así que en la
 * tablet no hay botón de atrás del navegador: si no está aquí, un niño que ha
 * entrado en la mecánica equivocada se queda dentro.
 *
 * Es lo único gris de la pantalla y va arriba a la izquierda, lejos de donde se
 * juega. Grande igual —un dedo de cinco años no apunta fino—, pero sin color:
 * lo que tiene que llamar la atención son los temas.
 */
export function Volver({ a }: { a: string }) {
  const textos = useTextos()

  return (
    <Link
      to={a}
      aria-label={textos.volver}
      className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_0_var(--color-trazo)] transition-transform active:translate-y-1 active:shadow-none"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-8"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke={TRAZO}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 4 L7 12 L15 20" />
      </svg>
    </Link>
  )
}
