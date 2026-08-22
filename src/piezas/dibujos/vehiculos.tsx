import { PALETA, TRAZO } from '../estilo'

/**
 * Tema `vehiculos`: cosas que se montan. El barco no está aquí, está en `mar`.
 */

export function Coche() {
  return (
    <>
      <path d="M74 130 L96 88 L164 88 L190 130 Z" fill={PALETA.rojo} />
      <rect x="24" y="126" width="208" height="62" rx="22" fill={PALETA.rojo} />
      <rect x="104" y="96" width="48" height="30" rx="6" fill={PALETA.blanco} />
      <circle cx="76" cy="190" r="26" fill={TRAZO} />
      <circle cx="180" cy="190" r="26" fill={TRAZO} />
      <circle cx="76" cy="190" r="10" fill={PALETA.blanco} />
      <circle cx="180" cy="190" r="10" fill={PALETA.blanco} />
    </>
  )
}

export function Autobus() {
  return (
    <>
      <rect x="26" y="56" width="204" height="132" rx="22" fill={PALETA.amarillo} />
      <rect x="48" y="80" width="46" height="42" rx="8" fill={PALETA.blanco} />
      <rect x="106" y="80" width="46" height="42" rx="8" fill={PALETA.blanco} />
      <rect x="164" y="80" width="46" height="42" rx="8" fill={PALETA.blanco} />
      <circle cx="74" cy="192" r="26" fill={TRAZO} />
      <circle cx="182" cy="192" r="26" fill={TRAZO} />
      <circle cx="74" cy="192" r="10" fill={PALETA.blanco} />
      <circle cx="182" cy="192" r="10" fill={PALETA.blanco} />
    </>
  )
}

export function Tren() {
  return (
    <>
      <circle cx="66" cy="46" r="18" fill={PALETA.blanco} />
      <circle cx="102" cy="26" r="12" fill={PALETA.blanco} />
      <rect x="48" y="70" width="36" height="52" rx="8" fill={PALETA.azul} />
      <rect x="24" y="118" width="88" height="66" rx="16" fill={PALETA.azul} />
      <rect x="104" y="76" width="128" height="108" rx="18" fill={PALETA.azul} />
      <rect x="128" y="98" width="66" height="48" rx="8" fill={PALETA.blanco} />
      <circle cx="70" cy="196" r="22" fill={TRAZO} />
      <circle cx="136" cy="196" r="22" fill={TRAZO} />
      <circle cx="200" cy="196" r="22" fill={TRAZO} />
    </>
  )
}

export function Avion() {
  return (
    <>
      <path d="M18 154 L106 108 L150 108 L238 154 L238 176 L150 148 L106 148 Z" fill={PALETA.azul} />
      <path d="M84 216 L108 186 L148 186 L172 216 Z" fill={PALETA.azul} />
      <rect x="104" y="30" width="48" height="188" rx="24" fill={PALETA.blanco} />
      <circle cx="128" cy="70" r="14" fill={PALETA.azul} />
    </>
  )
}

export function Camion() {
  return (
    <>
      <rect x="22" y="76" width="124" height="106" rx="14" fill={PALETA.verde} />
      <path d="M150 116 L196 116 L228 156 L228 182 L150 182 Z" fill={PALETA.azul} />
      <rect x="164" y="126" width="40" height="28" rx="6" fill={PALETA.blanco} />
      <circle cx="68" cy="188" r="26" fill={TRAZO} />
      <circle cx="190" cy="188" r="26" fill={TRAZO} />
      <circle cx="68" cy="188" r="10" fill={PALETA.blanco} />
      <circle cx="190" cy="188" r="10" fill={PALETA.blanco} />
    </>
  )
}

export function Bicicleta() {
  return (
    <>
      <circle cx="62" cy="168" r="52" fill={PALETA.blanco} />
      <circle cx="194" cy="168" r="52" fill={PALETA.blanco} />
      <circle cx="62" cy="168" r="10" fill={PALETA.azul} />
      <circle cx="194" cy="168" r="10" fill={PALETA.azul} />
      <path d="M62 168 L110 92 L164 92 L194 168" fill="none" />
      <path d="M110 92 L146 168 L62 168" fill="none" />
      <rect x="86" y="70" width="48" height="18" rx="9" fill={PALETA.azul} />
      <rect x="150" y="62" width="46" height="16" rx="8" fill={PALETA.azul} />
      <path d="M164 92 L172 70" fill="none" />
    </>
  )
}
