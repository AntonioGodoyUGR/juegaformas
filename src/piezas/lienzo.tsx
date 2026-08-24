import type { ReactNode } from 'react'
import { GROSOR, LIENZO, TRAZO } from './estilo'

/**
 * El lienzo compartido de todo lo que se dibuja: las cuarenta y dos piezas y
 * también los iconos de mecánica. El trazo y el `viewBox` viven aquí y en
 * ningún otro sitio, que es la única forma de que dibujos hechos en sesiones
 * distintas mantengan el mismo grosor.
 *
 * Sin `nombre` el dibujo es decorativo y se esconde del lector de pantalla. Eso
 * es lo correcto cuando la palabra ya está al lado —un icono dentro de un botón
 * que se llama «Encajar»— o cuando la misma pieza sale dos veces en pantalla.
 */
export function Lienzo({
  nombre,
  className,
  children,
}: {
  nombre?: string
  className?: string
  children: ReactNode
}) {
  return (
    <svg
      viewBox={`0 0 ${LIENZO} ${LIENZO}`}
      className={className}
      role="img"
      aria-hidden={nombre === undefined || undefined}
      aria-label={nombre}
      focusable="false"
    >
      <g
        stroke={TRAZO}
        strokeWidth={GROSOR}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {children}
      </g>
    </svg>
  )
}
