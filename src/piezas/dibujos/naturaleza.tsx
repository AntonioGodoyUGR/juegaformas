import { PALETA, TRAZO } from '../estilo'

/**
 * Tema `naturaleza`.
 */

export function Arbol() {
  return (
    <>
      <rect x="112" y="150" width="32" height="84" rx="10" fill={PALETA.naranja} />
      <circle cx="82" cy="136" r="44" fill={PALETA.verde} />
      <circle cx="174" cy="136" r="44" fill={PALETA.verde} />
      <circle cx="128" cy="96" r="64" fill={PALETA.verde} />
    </>
  )
}

export function Flor() {
  return (
    <>
      <circle cx="128" cy="62" r="36" fill={PALETA.rojo} />
      <circle cx="185" cy="95" r="36" fill={PALETA.rojo} />
      <circle cx="185" cy="161" r="36" fill={PALETA.rojo} />
      <circle cx="128" cy="194" r="36" fill={PALETA.rojo} />
      <circle cx="71" cy="161" r="36" fill={PALETA.rojo} />
      <circle cx="71" cy="95" r="36" fill={PALETA.rojo} />
      <circle cx="128" cy="128" r="42" fill={PALETA.amarillo} />
    </>
  )
}

export function Nube() {
  return (
    <path
      d="M62 190 A 40 40 0 0 1 72 114 A 50 50 0 0 1 156 88 A 40 40 0 0 1 202 140 A 30 30 0 0 1 196 190 Z"
      fill={PALETA.blanco}
    />
  )
}

export function Hoja() {
  return (
    <>
      <path d="M128 26 C200 78 200 178 128 230 C56 178 56 78 128 26 Z" fill={PALETA.verde} />
      <path d="M128 44 L128 214" fill="none" stroke={TRAZO} />
      <path d="M128 104 L92 82" fill="none" />
      <path d="M128 104 L164 82" fill="none" />
      <path d="M128 158 L92 136" fill="none" />
      <path d="M128 158 L164 136" fill="none" />
    </>
  )
}

export function Montana() {
  return (
    <>
      <path d="M132 214 L192 106 L246 214 Z" fill={PALETA.azul} />
      <path d="M14 214 L96 62 L178 214 Z" fill={PALETA.verde} />
      <path d="M96 62 L64 122 L82 112 L96 128 L112 110 L128 122 Z" fill={PALETA.blanco} />
    </>
  )
}

export function Seta() {
  return (
    <>
      <path d="M100 142 L156 142 L156 208 Q128 226 100 208 Z" fill={PALETA.blanco} />
      <path d="M28 148 A 100 84 0 0 1 228 148 Z" fill={PALETA.rojo} />
      <circle cx="84" cy="112" r="15" fill={PALETA.blanco} />
      <circle cx="146" cy="90" r="12" fill={PALETA.blanco} />
      <circle cx="178" cy="128" r="13" fill={PALETA.blanco} />
    </>
  )
}
