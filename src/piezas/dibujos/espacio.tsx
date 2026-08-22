import { PALETA, TRAZO } from '../estilo'

/**
 * Tema `espacio`. Cada dibujo es un fragmento: el trazo y el lienzo los pone
 * `<Pieza>`, así que aquí solo van formas y rellenos.
 */

export function Cohete() {
  return (
    <>
      <path d="M116 208 L92 232 L92 176 Z" fill={PALETA.rojo} />
      <path d="M140 208 L164 232 L164 176 Z" fill={PALETA.rojo} />
      <path d="M108 196 Q128 236 148 196 Z" fill={PALETA.naranja} />
      <path d="M128 24 C160 60 172 116 172 176 L84 176 C84 116 96 60 128 24 Z" fill={PALETA.blanco} />
      <circle cx="128" cy="104" r="24" fill={PALETA.azul} />
    </>
  )
}

export function Planeta() {
  return (
    <>
      <circle cx="128" cy="128" r="72" fill={PALETA.morado} />
      <circle cx="104" cy="100" r="16" fill={PALETA.blanco} />
      <circle cx="156" cy="148" r="12" fill={PALETA.blanco} />
      <ellipse
        cx="128"
        cy="132"
        rx="112"
        ry="32"
        fill="none"
        transform="rotate(-20 128 132)"
        stroke={TRAZO}
      />
    </>
  )
}

export function Estrella() {
  return (
    <polygon
      points="128,38 150,97 214,100 164,140 181,201 128,166 75,201 92,140 42,100 106,97"
      fill={PALETA.amarillo}
    />
  )
}

export function Luna() {
  return (
    <>
      {/*
        El creciente es el hueco entre dos círculos del mismo radio desplazados:
        el arco exterior va por el lado izquierdo del círculo centrado en 128,128
        y el interior vuelve por el izquierdo del centrado en 176,128. Los dos
        arcos comparten los extremos, así que el relleno queda entre ambos.
      */}
      <path d="M152 35 A 96 96 0 1 0 152 221 A 96 96 0 0 1 152 35 Z" fill={PALETA.amarillo} />
      <circle cx="60" cy="100" r="14" fill={PALETA.naranja} />
      <circle cx="62" cy="156" r="10" fill={PALETA.naranja} />
    </>
  )
}

export function Satelite() {
  return (
    <>
      <path d="M128 96 L128 56" fill="none" />
      <circle cx="128" cy="44" r="14" fill={PALETA.rojo} />
      <rect x="20" y="108" width="64" height="40" rx="8" fill={PALETA.azul} />
      <rect x="172" y="108" width="64" height="40" rx="8" fill={PALETA.azul} />
      <path d="M84 128 L172 128" fill="none" />
      <rect x="96" y="96" width="64" height="64" rx="12" fill={PALETA.blanco} />
      <rect x="112" y="180" width="32" height="40" rx="8" fill={PALETA.naranja} />
      <path d="M128 160 L128 180" fill="none" />
    </>
  )
}

export function Astronauta() {
  return (
    <>
      <path d="M72 232 C72 188 96 168 128 168 C160 168 184 188 184 232 Z" fill={PALETA.azul} />
      <circle cx="128" cy="112" r="68" fill={PALETA.blanco} />
      <path d="M92 104 A 40 40 0 0 1 164 104 L 164 124 A 38 38 0 0 1 92 124 Z" fill={TRAZO} />
      <rect x="108" y="216" width="40" height="16" rx="6" fill={PALETA.amarillo} />
    </>
  )
}
