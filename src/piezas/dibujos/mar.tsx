import { PALETA, TRAZO } from '../estilo'

/**
 * Tema `mar`: todo lo que vive o flota en el agua.
 */

export function Pez() {
  return (
    <>
      <path d="M190 128 L238 88 L238 168 Z" fill={PALETA.naranja} />
      <ellipse cx="116" cy="128" rx="80" ry="54" fill={PALETA.naranja} />
      <path d="M104 78 L148 74 L128 110 Z" fill={PALETA.amarillo} />
      <circle cx="76" cy="114" r="10" fill={TRAZO} />
      <path d="M150 128 L188 128" fill="none" />
    </>
  )
}

export function Pulpo() {
  return (
    <>
      <rect x="52" y="146" width="28" height="62" rx="14" fill={PALETA.morado} />
      <rect x="92" y="146" width="28" height="80" rx="14" fill={PALETA.morado} />
      <rect x="136" y="146" width="28" height="80" rx="14" fill={PALETA.morado} />
      <rect x="176" y="146" width="28" height="62" rx="14" fill={PALETA.morado} />
      <path d="M46 152 A 82 82 0 0 1 210 152 Z" fill={PALETA.morado} />
      <circle cx="102" cy="116" r="11" fill={TRAZO} />
      <circle cx="154" cy="116" r="11" fill={TRAZO} />
    </>
  )
}

export function Ballena() {
  return (
    <>
      <ellipse cx="56" cy="60" rx="15" ry="28" fill={PALETA.azul} transform="rotate(-34 56 60)" />
      <ellipse cx="96" cy="44" rx="15" ry="30" fill={PALETA.azul} />
      <ellipse cx="136" cy="60" rx="15" ry="28" fill={PALETA.azul} transform="rotate(34 136 60)" />
      <path d="M188 152 L242 104 L228 152 L242 200 Z" fill={PALETA.azul} />
      <ellipse cx="112" cy="152" rx="92" ry="58" fill={PALETA.azul} />
      <path d="M48 178 Q112 216 176 178" fill="none" />
      <circle cx="68" cy="140" r="9" fill={TRAZO} />
    </>
  )
}

export function Cangrejo() {
  return (
    <>
      <path d="M62 176 L26 200" fill="none" />
      <path d="M62 156 L22 164" fill="none" />
      <path d="M194 176 L230 200" fill="none" />
      <path d="M194 156 L234 164" fill="none" />
      <circle cx="44" cy="112" r="28" fill={PALETA.rojo} />
      <circle cx="212" cy="112" r="28" fill={PALETA.rojo} />
      <path d="M74 132 L104 152" fill="none" />
      <path d="M182 132 L152 152" fill="none" />
      <ellipse cx="128" cy="162" rx="72" ry="48" fill={PALETA.rojo} />
      <path d="M106 106 L106 74" fill="none" />
      <path d="M150 106 L150 74" fill="none" />
      <circle cx="106" cy="62" r="14" fill={PALETA.blanco} />
      <circle cx="150" cy="62" r="14" fill={PALETA.blanco} />
    </>
  )
}

export function Medusa() {
  return (
    <>
      <path d="M78 156 Q64 190 82 216 Q100 240 88 246" fill="none" />
      <path d="M112 158 Q100 194 116 220 Q130 244 120 250" fill="none" />
      <path d="M146 158 Q158 194 142 220 Q128 244 138 250" fill="none" />
      <path d="M180 156 Q194 190 176 216 Q158 240 170 246" fill="none" />
      <path d="M42 154 A 86 86 0 0 1 214 154 Z" fill={PALETA.morado} />
      <circle cx="100" cy="116" r="10" fill={TRAZO} />
      <circle cx="156" cy="116" r="10" fill={TRAZO} />
    </>
  )
}

export function Caracola() {
  return (
    <>
      <path d="M30 194 A 100 100 0 0 1 226 194 Z" fill={PALETA.naranja} />
      <path d="M128 194 L52 152" fill="none" />
      <path d="M128 194 L86 114" fill="none" />
      <path d="M128 194 L128 94" fill="none" />
      <path d="M128 194 L170 114" fill="none" />
      <path d="M128 194 L204 152" fill="none" />
    </>
  )
}
