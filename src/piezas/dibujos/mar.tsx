import { DETALLE, PALETA, SOMBRA, TRAZO } from '../estilo'

/**
 * Tema `mar`: todo lo que vive o flota en el agua. El barco no está aquí, está
 * en `vehiculos`, porque lo que manda es qué es la cosa y no dónde se la
 * encuentra.
 */

export function Pez() {
  return (
    <>
      <path d="M182 128 L238 84 L226 128 L238 172 Z" fill={SOMBRA.azul} />
      <path d="M226 128 L238 172 L182 128 Z" fill={PALETA.azul} stroke="none" />
      <path d="M112 78 Q132 48 158 76 Z" fill={PALETA.amarillo} />
      <path d="M114 178 Q132 208 156 180 Z" fill={PALETA.amarillo} />
      <ellipse cx="118" cy="128" rx="82" ry="54" fill={PALETA.azul} />
      <path d="M118 74 A 82 54 0 0 1 118 182 A 82 54 0 0 0 118 74 Z" fill={SOMBRA.azul} stroke="none" />
      <path d="M96 106 q14 16 28 0 M124 106 q14 16 28 0 M152 106 q14 16 28 0" fill="none" stroke={SOMBRA.azul} strokeWidth={DETALLE} />
      <path d="M110 132 q14 16 28 0 M138 132 q14 16 28 0 M166 132 q14 16 28 0" fill="none" stroke={SOMBRA.azul} strokeWidth={DETALLE} />
      <path d="M96 158 q14 16 28 0 M124 158 q14 16 28 0 M152 158 q14 16 28 0" fill="none" stroke={SOMBRA.azul} strokeWidth={DETALLE} />
      <path d="M76 88 Q60 128 76 168" fill="none" strokeWidth={DETALLE} />
      <circle cx="62" cy="116" r="11" fill={PALETA.blanco} />
      <circle cx="60" cy="116" r="5" fill={TRAZO} stroke="none" />
      <path d="M38 140 Q48 148 58 142" fill="none" strokeWidth={DETALLE} />
      <circle cx="30" cy="98" r="9" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="44" cy="72" r="6" fill={PALETA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Pulpo() {
  return (
    <>
      <path d="M50 160 Q34 210 54 232 Q74 214 68 168 Z" fill={SOMBRA.morado} />
      <path d="M94 172 Q84 220 106 236 Q124 216 112 174 Z" fill={PALETA.morado} />
      <path d="M144 174 Q156 220 134 236 Q116 216 128 172 Z" fill={PALETA.morado} />
      <path d="M206 160 Q222 210 202 232 Q182 214 188 168 Z" fill={SOMBRA.morado} />
      <circle cx="52" cy="204" r="6" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="104" cy="212" r="6" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="132" cy="212" r="6" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="204" cy="204" r="6" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <path d="M46 172 A 82 82 0 0 1 210 172 Z" fill={SOMBRA.morado} />
      <path d="M46 172 A 82 82 0 0 1 168 100 Q118 132 118 172 Z" fill={PALETA.morado} stroke="none" />
      <circle cx="86" cy="118" r="9" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="164" cy="106" r="7" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="100" cy="146" r="16" fill={PALETA.blanco} />
      <circle cx="156" cy="146" r="16" fill={PALETA.blanco} />
      <circle cx="104" cy="148" r="7" fill={TRAZO} stroke="none" />
      <circle cx="160" cy="148" r="7" fill={TRAZO} stroke="none" />
      <path d="M114 174 Q128 186 142 174" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Ballena() {
  return (
    <>
      <path d="M92 62 Q78 34 88 20" fill="none" stroke={PALETA.azul} strokeWidth={DETALLE} />
      <path d="M104 60 Q106 30 120 18" fill="none" stroke={PALETA.azul} strokeWidth={DETALLE} />
      <circle cx="84" cy="16" r="9" fill={PALETA.azul} strokeWidth={DETALLE} />
      <circle cx="124" cy="14" r="7" fill={PALETA.azul} strokeWidth={DETALLE} />
      <circle cx="106" cy="34" r="6" fill={PALETA.azul} strokeWidth={DETALLE} />
      <path d="M186 148 L242 100 L228 148 L242 200 Z" fill={SOMBRA.azul} />
      <path d="M228 148 L242 200 L186 148 Z" fill={PALETA.azul} stroke="none" />
      <ellipse cx="114" cy="148" rx="94" ry="60" fill={PALETA.azul} />
      <path d="M28 164 Q114 216 200 164 Q114 200 28 164 Z" fill={PALETA.blanco} stroke="none" />
      <path d="M28 164 Q114 216 200 164" fill="none" strokeWidth={DETALLE} />
      <path d="M32 178 L34 194 M56 194 L54 208 M84 202 L84 216 M114 204 L114 218" fill="none" strokeWidth={DETALLE} />
      <path d="M120 176 Q150 200 168 176 Z" fill={SOMBRA.azul} strokeWidth={DETALLE} />
      <path d="M42 118 Q64 96 90 108" fill="none" strokeWidth={DETALLE} />
      <circle cx="66" cy="134" r="11" fill={PALETA.blanco} />
      <circle cx="63" cy="134" r="5" fill={TRAZO} stroke="none" />
      <path d="M24 152 Q36 162 50 156" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Cangrejo() {
  return (
    <>
      <path d="M52 172 L20 196 M60 190 L34 218 M76 202 L60 232" fill="none" />
      <path d="M204 172 L236 196 M196 190 L222 218 M180 202 L196 232" fill="none" />
      <path d="M40 108 Q22 84 40 62 Q58 78 62 100 Z" fill={PALETA.rojo} />
      <path d="M40 62 Q58 78 62 100 Q46 92 40 62 Z" fill={SOMBRA.rojo} stroke="none" />
      <path d="M216 108 Q234 84 216 62 Q198 78 194 100 Z" fill={PALETA.rojo} />
      <path d="M216 62 Q198 78 194 100 Q210 92 216 62 Z" fill={SOMBRA.rojo} stroke="none" />
      <path d="M52 116 L34 106 M204 116 L222 106" fill="none" />
      <ellipse cx="128" cy="152" rx="80" ry="52" fill={PALETA.rojo} />
      <path d="M128 100 A 80 52 0 0 1 128 204 A 80 52 0 0 0 128 100 Z" fill={SOMBRA.rojo} stroke="none" />
      <circle cx="88" cy="176" r="8" fill={SOMBRA.rojo} strokeWidth={DETALLE} />
      <circle cx="128" cy="188" r="7" fill={SOMBRA.rojo} strokeWidth={DETALLE} />
      <circle cx="166" cy="176" r="8" fill={SOMBRA.rojo} strokeWidth={DETALLE} />
      <path d="M112 170 Q128 182 144 170" fill="none" strokeWidth={DETALLE} />
      <path d="M100 116 L96 84 M156 116 L160 84" fill="none" />
      <circle cx="94" cy="74" r="16" fill={PALETA.blanco} />
      <circle cx="162" cy="74" r="16" fill={PALETA.blanco} />
      <circle cx="94" cy="76" r="7" fill={TRAZO} stroke="none" />
      <circle cx="162" cy="76" r="7" fill={TRAZO} stroke="none" />
    </>
  )
}

export function Medusa() {
  return (
    <>
      <path d="M70 176 Q56 200 70 220 Q84 238 72 250" fill="none" stroke={PALETA.morado} />
      <path d="M108 180 Q94 204 108 226 Q120 244 108 252" fill="none" stroke={SOMBRA.morado} />
      <path d="M148 180 Q162 204 148 226 Q136 244 148 252" fill="none" stroke={SOMBRA.morado} />
      <path d="M186 176 Q200 200 186 220 Q172 238 184 250" fill="none" stroke={PALETA.morado} />
      <path d="M34 168 A 94 88 0 0 1 222 168 Z" fill={SOMBRA.morado} />
      <path d="M34 168 A 94 88 0 0 1 168 88 Q112 122 112 168 Z" fill={PALETA.morado} stroke="none" />
      {/* El borde de abajo va festoneado: es lo que separa una medusa de una seta. */}
      <path d="M34 168 q23 22 47 0 q23 22 47 0 q23 22 47 0 q23 22 47 0" fill="none" />
      <circle cx="82" cy="98" r="10" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="160" cy="86" r="8" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="186" cy="118" r="7" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="102" cy="140" r="11" fill={TRAZO} />
      <circle cx="154" cy="140" r="11" fill={TRAZO} />
      <circle cx="98" cy="135" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="150" cy="135" r="4" fill={PALETA.blanco} stroke="none" />
      <path d="M112 162 Q128 174 144 162" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Caracola() {
  return (
    <>
      {/* Abanico y no espiral: la espiral se convierte en un garabato al reducirla. */}
      <path d="M30 190 A 100 100 0 0 1 226 190 Z" fill={SOMBRA.rojo} />
      <path d="M30 190 A 100 100 0 0 1 128 90 L128 190 Z" fill={PALETA.rojo} stroke="none" />
      <path d="M128 90 L128 190 M76 108 L104 190 M180 108 L152 190 M44 146 L82 190 M212 146 L174 190" fill="none" strokeWidth={DETALLE} />
      <path d="M30 190 q25 22 49 0 q25 22 49 0 q25 22 49 0 q25 22 49 0" fill="none" />
      <ellipse cx="128" cy="96" rx="24" ry="14" fill={PALETA.blanco} />
      <path d="M116 96 Q128 86 140 96" fill="none" strokeWidth={DETALLE} />
    </>
  )
}
