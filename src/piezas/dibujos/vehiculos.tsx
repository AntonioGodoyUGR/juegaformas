import { DETALLE, PALETA, SOMBRA, TRAZO } from '../estilo'

/**
 * Tema `vehiculos`: cosas que se montan. El barco no está aquí, está en `mar`.
 *
 * Las carrocerías son rectángulos redondeados, así que la sombra va como banda
 * inferior dibujada con el mismo radio de esquina que la silueta: se apoya en
 * el borde de abajo sin tocar el contorno. La bicicleta es la excepción y no
 * lleva sombra: no tiene ninguna masa grande donde caiga, y lo que le da
 * volumen son los radios.
 */

export function Coche() {
  return (
    <>
      {/* La cabina primero: la carrocería la tapa por abajo. */}
      <path d="M74 130 L96 88 L164 88 L190 130 Z" fill={PALETA.rojo} />
      <path d="M148 88 L164 88 L190 130 L156 130 Z" fill={SOMBRA.rojo} stroke="none" />
      <rect x="104" y="96" width="48" height="30" rx="6" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="134" y="100" width="12" height="22" rx="5" fill={SOMBRA.blanco} stroke="none" />
      <rect x="24" y="126" width="208" height="62" rx="22" fill={PALETA.rojo} />
      <path d="M24 158 L232 158 L232 166 A 22 22 0 0 1 210 188 L46 188 A 22 22 0 0 1 24 166 Z" fill={SOMBRA.rojo} stroke="none" />
      <path d="M120 132 L120 156" fill="none" strokeWidth={DETALLE} />
      <circle cx="214" cy="146" r="10" fill={PALETA.amarillo} strokeWidth={DETALLE} />
      <circle cx="76" cy="190" r="26" fill={TRAZO} />
      <circle cx="180" cy="190" r="26" fill={TRAZO} />
      <circle cx="76" cy="190" r="11" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="180" cy="190" r="11" fill={PALETA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Autobus() {
  return (
    <>
      <rect x="26" y="56" width="204" height="132" rx="22" fill={PALETA.amarillo} />
      <path d="M26 156 L230 156 L230 166 A 22 22 0 0 1 208 188 L48 188 A 22 22 0 0 1 26 166 Z" fill={SOMBRA.amarillo} stroke="none" />
      <rect x="48" y="80" width="46" height="42" rx="8" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="106" y="80" width="46" height="42" rx="8" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="164" y="80" width="46" height="42" rx="8" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="76" y="86" width="12" height="30" rx="5" fill={SOMBRA.blanco} stroke="none" />
      <rect x="134" y="86" width="12" height="30" rx="5" fill={SOMBRA.blanco} stroke="none" />
      <rect x="192" y="86" width="12" height="30" rx="5" fill={SOMBRA.blanco} stroke="none" />
      <path d="M40 138 L216 138" fill="none" stroke={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="74" cy="192" r="26" fill={TRAZO} />
      <circle cx="182" cy="192" r="26" fill={TRAZO} />
      <circle cx="74" cy="192" r="11" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="182" cy="192" r="11" fill={PALETA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Tren() {
  return (
    <>
      <circle cx="66" cy="46" r="20" fill={SOMBRA.blanco} />
      <circle cx="62" cy="42" r="15" fill={PALETA.blanco} stroke="none" />
      <circle cx="104" cy="24" r="13" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="48" y="70" width="36" height="52" rx="8" fill={PALETA.azul} />
      <rect x="66" y="78" width="11" height="36" rx="5" fill={SOMBRA.azul} stroke="none" />
      <rect x="24" y="118" width="88" height="66" rx="16" fill={PALETA.azul} />
      <path d="M24 158 L112 158 L112 168 A 16 16 0 0 1 96 184 L40 184 A 16 16 0 0 1 24 168 Z" fill={SOMBRA.azul} stroke="none" />
      <rect x="104" y="76" width="128" height="108" rx="18" fill={PALETA.azul} />
      <path d="M104 152 L232 152 L232 166 A 18 18 0 0 1 214 184 L122 184 A 18 18 0 0 1 104 166 Z" fill={SOMBRA.azul} stroke="none" />
      <rect x="128" y="98" width="66" height="48" rx="8" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="172" y="106" width="14" height="32" rx="6" fill={SOMBRA.blanco} stroke="none" />
      <circle cx="70" cy="196" r="22" fill={TRAZO} />
      <circle cx="136" cy="196" r="22" fill={TRAZO} />
      <circle cx="200" cy="196" r="22" fill={TRAZO} />
      <circle cx="70" cy="196" r="9" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="136" cy="196" r="9" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="200" cy="196" r="9" fill={PALETA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Avion() {
  return (
    <>
      {/* El ala y el timón de la derecha van enteros en sombra: el fuselaje tapa la costura. */}
      <path d="M18 154 L106 108 L150 108 L238 154 L238 176 L150 148 L106 148 Z" fill={PALETA.azul} />
      <path d="M150 108 L238 154 L238 176 L150 148 Z" fill={SOMBRA.azul} stroke="none" />
      <path d="M84 216 L108 186 L148 186 L172 216 Z" fill={PALETA.azul} />
      <path d="M128 186 L148 186 L172 216 L128 216 Z" fill={SOMBRA.azul} stroke="none" />
      <rect x="104" y="30" width="48" height="188" rx="24" fill={PALETA.blanco} />
      <rect x="130" y="46" width="14" height="156" rx="7" fill={SOMBRA.blanco} stroke="none" />
      <circle cx="119" cy="72" r="10" fill={PALETA.azul} strokeWidth={DETALLE} />
      <circle cx="119" cy="110" r="10" fill={PALETA.azul} strokeWidth={DETALLE} />
      <circle cx="119" cy="148" r="10" fill={PALETA.azul} strokeWidth={DETALLE} />
    </>
  )
}

export function Camion() {
  return (
    <>
      <rect x="22" y="76" width="124" height="106" rx="14" fill={PALETA.verde} />
      <path d="M22 152 L146 152 L146 168 A 14 14 0 0 1 132 182 L36 182 A 14 14 0 0 1 22 168 Z" fill={SOMBRA.verde} stroke="none" />
      <path d="M84 82 L84 176" fill="none" strokeWidth={DETALLE} />
      <path d="M150 116 L196 116 L228 156 L228 182 L150 182 Z" fill={PALETA.azul} />
      <path d="M150 164 L228 164 L228 182 L150 182 Z" fill={SOMBRA.azul} stroke="none" />
      <rect x="164" y="126" width="40" height="28" rx="6" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="188" y="132" width="10" height="16" rx="5" fill={SOMBRA.blanco} stroke="none" />
      <circle cx="68" cy="188" r="26" fill={TRAZO} />
      <circle cx="190" cy="188" r="26" fill={TRAZO} />
      <circle cx="68" cy="188" r="11" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="190" cy="188" r="11" fill={PALETA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Bicicleta() {
  return (
    <>
      {/*
        Los radios van en la sombra del blanco, no en el trazo: con el color del
        contorno competirían con el cuadro y la bicicleta se leería como una
        maraña de líneas.
      */}
      <circle cx="62" cy="168" r="52" fill={PALETA.blanco} />
      <circle cx="194" cy="168" r="52" fill={PALETA.blanco} />
      <path d="M62 120 L62 216 M28 134 L96 202 M14 168 L110 168 M28 202 L96 134" fill="none" stroke={SOMBRA.blanco} strokeWidth={DETALLE} />
      <path d="M194 120 L194 216 M160 134 L228 202 M146 168 L242 168 M160 202 L228 134" fill="none" stroke={SOMBRA.blanco} strokeWidth={DETALLE} />
      <path d="M62 168 L110 92 L164 92 L194 168" fill="none" />
      <path d="M110 92 L146 168 L62 168" fill="none" />
      <path d="M164 92 L172 70" fill="none" />
      <rect x="86" y="70" width="48" height="18" rx="9" fill={PALETA.azul} />
      <rect x="150" y="62" width="46" height="16" rx="8" fill={PALETA.azul} />
      <circle cx="62" cy="168" r="10" fill={PALETA.azul} strokeWidth={DETALLE} />
      <circle cx="194" cy="168" r="10" fill={PALETA.azul} strokeWidth={DETALLE} />
    </>
  )
}
