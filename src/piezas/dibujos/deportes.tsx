import { PALETA, TRAZO } from '../estilo'

/**
 * Tema `deportes`: objetos con los que se juega, nunca vehículos. La bicicleta
 * vive en `vehiculos` porque es algo que se monta.
 */

export function Balon() {
  return (
    <>
      <circle cx="128" cy="128" r="92" fill={PALETA.blanco} />
      <path d="M128 84 L166 112 L152 158 L104 158 L90 112 Z" fill={TRAZO} />
      <path d="M128 84 L128 40" fill="none" />
      <path d="M166 112 L208 98" fill="none" />
      <path d="M152 158 L178 196" fill="none" />
      <path d="M104 158 L78 196" fill="none" />
      <path d="M90 112 L48 98" fill="none" />
    </>
  )
}

export function Canasta() {
  return (
    <>
      <rect x="48" y="24" width="160" height="104" rx="12" fill={PALETA.blanco} />
      <rect x="96" y="60" width="64" height="48" rx="6" fill={PALETA.rojo} />
      <path d="M90 154 L112 202" fill="none" />
      <path d="M128 156 L128 208" fill="none" />
      <path d="M166 154 L144 202" fill="none" />
      <path d="M108 184 L148 184" fill="none" />
      <rect x="76" y="132" width="104" height="20" rx="10" fill={PALETA.naranja} />
    </>
  )
}

export function Raqueta() {
  return (
    <>
      <rect x="112" y="150" width="32" height="88" rx="16" fill={PALETA.naranja} />
      <ellipse cx="128" cy="102" rx="66" ry="78" fill={PALETA.blanco} />
      <path d="M100 34 L100 168" fill="none" />
      <path d="M156 34 L156 168" fill="none" />
      <path d="M66 76 L190 76" fill="none" />
      <path d="M66 128 L190 128" fill="none" />
    </>
  )
}

export function Medalla() {
  return (
    <>
      <path d="M74 22 L118 22 L146 112 L102 112 Z" fill={PALETA.azul} />
      <path d="M182 22 L138 22 L110 112 L154 112 Z" fill={PALETA.rojo} />
      <circle cx="128" cy="172" r="64" fill={PALETA.amarillo} />
      <circle cx="128" cy="172" r="34" fill={PALETA.naranja} />
    </>
  )
}

export function Pesa() {
  return (
    <>
      <rect x="58" y="110" width="140" height="36" rx="10" fill={PALETA.blanco} />
      <rect x="26" y="70" width="48" height="116" rx="16" fill={PALETA.azul} />
      <rect x="182" y="70" width="48" height="116" rx="16" fill={PALETA.azul} />
    </>
  )
}

export function Porteria() {
  return (
    <>
      <path d="M60 96 L60 200" fill="none" />
      <path d="M196 96 L196 200" fill="none" />
      <path d="M60 96 L196 96" fill="none" />
      <rect x="40" y="76" width="24" height="128" rx="10" fill={PALETA.blanco} />
      <rect x="192" y="76" width="24" height="128" rx="10" fill={PALETA.blanco} />
      <rect x="40" y="76" width="176" height="24" rx="10" fill={PALETA.blanco} />
      <path d="M100 108 L100 200" fill="none" />
      <path d="M156 108 L156 200" fill="none" />
      <path d="M68 140 L188 140" fill="none" />
      <path d="M68 172 L188 172" fill="none" />
      <circle cx="128" cy="222" r="26" fill={PALETA.verde} />
    </>
  )
}
