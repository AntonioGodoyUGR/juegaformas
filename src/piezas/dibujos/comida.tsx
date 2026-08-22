import { PALETA } from '../estilo'

/**
 * Tema `comida`.
 */

export function Manzana() {
  return (
    <>
      <path d="M128 76 L128 40" fill="none" />
      <ellipse cx="166" cy="52" rx="34" ry="20" fill={PALETA.verde} transform="rotate(-20 166 52)" />
      <path
        d="M128 82 C 96 52 40 66 34 124 C 28 180 78 226 106 214 C 118 208 138 208 150 214 C 178 226 228 180 222 124 C 216 66 160 52 128 82 Z"
        fill={PALETA.rojo}
      />
    </>
  )
}

export function Platano() {
  return (
    <path
      d="M44 66 A 132 132 0 0 0 200 210 A 104 104 0 0 1 44 66 Z"
      fill={PALETA.amarillo}
    />
  )
}

export function Zanahoria() {
  return (
    <>
      <ellipse cx="94" cy="66" rx="20" ry="38" fill={PALETA.verde} transform="rotate(-28 94 66)" />
      <ellipse cx="162" cy="66" rx="20" ry="38" fill={PALETA.verde} transform="rotate(28 162 66)" />
      <ellipse cx="128" cy="56" rx="20" ry="40" fill={PALETA.verde} />
      <path d="M128 238 L82 104 L174 104 Z" fill={PALETA.naranja} />
      <path d="M104 140 L128 148" fill="none" />
      <path d="M114 182 L136 190" fill="none" />
    </>
  )
}

export function Pan() {
  return (
    <>
      <path
        d="M32 148 C 32 78 224 78 224 148 Q224 194 192 194 L64 194 Q32 194 32 148 Z"
        fill={PALETA.naranja}
      />
      <path d="M76 128 L98 104" fill="none" />
      <path d="M118 128 L140 104" fill="none" />
      <path d="M160 128 L182 104" fill="none" />
    </>
  )
}

export function Queso() {
  return (
    <>
      <path d="M34 196 L222 196 L34 96 Z" fill={PALETA.amarillo} />
      <circle cx="74" cy="170" r="15" fill={PALETA.blanco} />
      <circle cx="128" cy="180" r="12" fill={PALETA.blanco} />
      <circle cx="66" cy="128" r="10" fill={PALETA.blanco} />
    </>
  )
}

export function Helado() {
  return (
    <>
      <path d="M84 132 L172 132 L128 236 Z" fill={PALETA.naranja} />
      <path d="M100 166 L136 148" fill="none" />
      <path d="M112 196 L150 176" fill="none" />
      <circle cx="128" cy="98" r="60" fill={PALETA.morado} />
      <circle cx="128" cy="34" r="16" fill={PALETA.rojo} />
    </>
  )
}
