import { DETALLE, PALETA, SOMBRA, TRAZO } from '../estilo'

/**
 * Tema `deportes`: objetos con los que se juega, nunca vehículos. La bicicleta
 * vive en `vehiculos` porque es algo que se monta.
 */

export function Balon() {
  return (
    <>
      <circle cx="128" cy="128" r="88" fill={PALETA.blanco} />
      <path d="M128 40 A 88 88 0 0 1 128 216 A 74 74 0 0 0 128 40 Z" fill={SOMBRA.blanco} stroke="none" />
      <path d="M128 88 L166 116 L152 160 L104 160 L90 116 Z" fill={TRAZO} />
      <path d="M128 88 L128 40 M166 116 L212 101 M152 160 L180 199 M104 160 L76 199 M90 116 L44 101" fill="none" strokeWidth={DETALLE} />
      <path d="M164 94 L179 83 L173 65 L155 65 L149 83 Z" fill={TRAZO} />
      <path d="M187 163 L202 152 L196 134 L178 134 L172 152 Z" fill={TRAZO} />
      <path d="M128 206 L143 195 L137 177 L119 177 L113 195 Z" fill={TRAZO} />
      <path d="M69 163 L84 152 L78 134 L60 134 L54 152 Z" fill={TRAZO} />
      <path d="M92 94 L107 83 L101 65 L83 65 L77 83 Z" fill={TRAZO} />
    </>
  )
}

export function Canasta() {
  return (
    <>
      <rect x="44" y="28" width="168" height="116" rx="10" fill={PALETA.blanco} />
      <path d="M170 30 Q210 30 210 62 L210 110 Q210 142 170 142 Z" fill={SOMBRA.blanco} stroke="none" />
      <rect x="94" y="66" width="68" height="54" rx="6" fill={PALETA.rojo} strokeWidth={DETALLE} />
      <rect x="88" y="146" width="80" height="16" rx="8" fill={PALETA.naranja} />
      <path d="M96 162 L108 192 L120 162 L132 192 L144 162 L156 192" fill="none" strokeWidth={DETALLE} />
      <path d="M102 178 L154 178" fill="none" strokeWidth={DETALLE} />
      <path d="M108 192 L118 210 L128 192 L138 210 L148 192" fill="none" strokeWidth={DETALLE} />
      <path d="M118 210 L148 210" fill="none" strokeWidth={DETALLE} />
      <path d="M128 28 L128 12" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Raqueta() {
  return (
    <>
      <rect x="112" y="160" width="32" height="76" rx="14" fill={PALETA.naranja} />
      <path d="M144 160 Q152 176 152 200 Q152 226 144 236 L128 236 Q136 220 136 198 Q136 176 128 160 Z" fill={SOMBRA.naranja} stroke="none" />
      <path d="M114 180 L142 174 M114 198 L142 192 M114 216 L142 210" fill="none" strokeWidth={DETALLE} />
      <path d="M112 172 L96 148 M144 172 L160 148" fill="none" />
      <ellipse cx="128" cy="96" rx="64" ry="72" fill={SOMBRA.blanco} />
      <ellipse cx="122" cy="90" rx="52" ry="60" fill={PALETA.blanco} stroke="none" />
      <path d="M80 48 L80 144 M104 29 L104 163 M128 24 L128 168 M152 29 L152 163 M176 48 L176 144" fill="none" strokeWidth={DETALLE} />
      <path d="M80 48 L176 48 M68 72 L188 72 M64 96 L192 96 M68 120 L188 120 M80 144 L176 144" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Medalla() {
  return (
    <>
      <path d="M72 22 L114 126 L146 114 L110 22 Z" fill={PALETA.azul} />
      <path d="M184 22 L142 126 L110 114 L146 22 Z" fill={PALETA.rojo} />
      <path d="M92 70 L124 58 M164 70 L132 58" fill="none" strokeWidth={DETALLE} />
      <circle cx="128" cy="172" r="62" fill={SOMBRA.amarillo} />
      <circle cx="120" cy="164" r="52" fill={PALETA.amarillo} stroke="none" />
      <circle cx="128" cy="172" r="46" fill="none" strokeWidth={DETALLE} />
      <path d="M128 146 L134 163 L153 164 L139 175 L143 193 L128 183 L113 193 L118 175 L103 164 L122 163 Z" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
    </>
  )
}

export function Pesa() {
  return (
    <>
      <rect x="40" y="114" width="176" height="28" rx="12" fill={PALETA.blanco} />
      <path d="M40 138 L216 138 L216 130 L40 130 Z" fill={SOMBRA.blanco} stroke="none" />
      <path d="M110 118 L110 138 M124 118 L124 138 M138 118 L138 138 M152 118 L152 138" fill="none" strokeWidth={DETALLE} />
      <rect x="86" y="98" width="18" height="60" rx="7" fill={PALETA.blanco} />
      <rect x="152" y="98" width="18" height="60" rx="7" fill={PALETA.blanco} />
      <rect x="42" y="72" width="38" height="112" rx="14" fill={PALETA.azul} />
      <rect x="176" y="72" width="38" height="112" rx="14" fill={PALETA.azul} />
      <rect x="52" y="88" width="18" height="80" rx="8" fill={SOMBRA.azul} strokeWidth={DETALLE} />
      <rect x="186" y="88" width="18" height="80" rx="8" fill={SOMBRA.azul} strokeWidth={DETALLE} />
    </>
  )
}

export function Porteria() {
  return (
    <>
      <path d="M50 84 L206 84 M50 116 L206 116 M50 148 L206 148 M50 180 L206 180" fill="none" stroke={SOMBRA.blanco} strokeWidth={DETALLE} />
      <path d="M74 76 L74 208 M106 76 L106 208 M138 76 L138 208 M170 76 L170 208" fill="none" stroke={SOMBRA.blanco} strokeWidth={DETALLE} />
      <rect x="30" y="56" width="196" height="18" rx="8" fill={PALETA.blanco} />
      <rect x="30" y="56" width="18" height="160" rx="8" fill={PALETA.blanco} />
      <rect x="208" y="56" width="18" height="160" rx="8" fill={PALETA.blanco} />
      <path d="M30 208 L226 208" fill="none" />
      <circle cx="168" cy="182" r="28" fill={PALETA.verde} />
      <path d="M168 168 L180 177 L175 191 L161 191 L156 177 Z" fill={TRAZO} stroke="none" />
    </>
  )
}
