import { DETALLE, PALETA, SOMBRA } from '../estilo'

/**
 * Tema `comida`. Cosas que se comen, dibujadas de perfil y enteras: una manzana
 * mordida o media pizza obligan a explicar qué falta, y a esta edad eso sobra.
 */

export function Manzana() {
  return (
    <>
      <path d="M128 84 L132 44" fill="none" stroke={SOMBRA.naranja} />
      <path d="M136 46 Q176 26 194 48 Q168 78 136 62 Z" fill={PALETA.verde} />
      <path d="M138 54 Q166 46 194 48" fill="none" stroke={SOMBRA.verde} strokeWidth={DETALLE} />
      <path
        d="M128 82 C 96 52 40 66 34 124 C 28 180 78 226 106 214 C 118 208 138 208 150 214 C 178 226 228 180 222 124 C 216 66 160 52 128 82 Z"
        fill={SOMBRA.rojo}
      />
      <path
        d="M128 82 C 96 52 40 66 34 124 C 28 180 78 226 106 214 C 116 210 122 200 126 184 C 130 152 130 112 128 82 Z"
        fill={PALETA.rojo}
        stroke="none"
      />
      <path d="M62 116 Q70 92 92 84" fill="none" stroke={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M58 140 Q58 132 60 124" fill="none" stroke={PALETA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Platano() {
  return (
    <>
      {/*
        La media luna es la franja entre dos arcos con los mismos extremos: el de
        radio 132 hace el lomo y el de 104 vuelve por la parte cóncava. La sombra
        es la misma franja pero con un arco intermedio de 118.
      */}
      <path d="M44 66 A 132 132 0 0 0 200 210 A 104 104 0 0 1 44 66 Z" fill={PALETA.amarillo} />
      <path d="M44 66 A 118 118 0 0 0 200 210 A 104 104 0 0 1 44 66 Z" fill={SOMBRA.amarillo} stroke="none" />
      <path d="M44 66 A 118 118 0 0 0 200 210" fill="none" strokeWidth={DETALLE} />
      <path d="M62 82 A 122 122 0 0 0 100 158" fill="none" stroke={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <path d="M40 78 Q32 60 46 50 Q58 56 56 74 Z" fill={SOMBRA.naranja} />
      <path d="M196 198 Q214 204 214 218 Q200 224 190 210 Z" fill={SOMBRA.naranja} />
    </>
  )
}

export function Zanahoria() {
  return (
    <>
      <path d="M128 96 L96 40" fill="none" stroke={SOMBRA.verde} />
      <path d="M128 96 L128 34" fill="none" stroke={SOMBRA.verde} />
      <path d="M128 96 L162 42" fill="none" stroke={SOMBRA.verde} />
      <ellipse cx="88" cy="36" rx="26" ry="17" transform="rotate(-32 88 36)" fill={PALETA.verde} />
      <ellipse cx="128" cy="26" rx="20" ry="26" fill={PALETA.verde} />
      <ellipse cx="170" cy="38" rx="26" ry="17" transform="rotate(30 170 38)" fill={PALETA.verde} />
      <path d="M128 238 L82 100 Q128 84 174 100 Z" fill={PALETA.naranja} />
      <path d="M128 238 L174 100 Q152 92 128 90 Z" fill={SOMBRA.naranja} stroke="none" />
      <path d="M96 124 L118 118 M110 158 L134 152 M120 190 L142 184" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Pan() {
  return (
    <>
      <path d="M30 166 Q30 72 128 72 Q226 72 226 166 Q226 198 194 198 L62 198 Q30 198 30 166 Z" fill={SOMBRA.naranja} />
      <path d="M30 166 Q30 72 128 72 Q98 100 94 198 L62 198 Q30 198 30 166 Z" fill={PALETA.naranja} stroke="none" />
      <path d="M30 162 Q128 184 226 162" fill="none" strokeWidth={DETALLE} />
      <path d="M66 132 Q84 108 106 106" fill="none" strokeWidth={DETALLE} />
      <path d="M108 120 Q126 96 148 94" fill="none" strokeWidth={DETALLE} />
      <path d="M150 126 Q168 104 188 106" fill="none" strokeWidth={DETALLE} />
      <ellipse cx="82" cy="180" rx="8" ry="5" fill={PALETA.blanco} stroke="none" />
      <ellipse cx="128" cy="186" rx="8" ry="5" fill={PALETA.blanco} stroke="none" />
      <ellipse cx="174" cy="180" rx="8" ry="5" fill={PALETA.blanco} stroke="none" />
    </>
  )
}

export function Queso() {
  return (
    <>
      <path d="M40 104 L146 70 L228 106 L122 140 Z" fill={PALETA.amarillo} />
      <path d="M40 104 L40 158 L122 194 L122 140 Z" fill={PALETA.amarillo} />
      <path d="M122 140 L122 194 L228 160 L228 106 Z" fill={SOMBRA.amarillo} />
      <circle cx="84" cy="106" r="12" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="160" cy="98" r="9" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="68" cy="140" r="11" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="100" cy="168" r="9" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="160" cy="158" r="10" fill={PALETA.amarillo} strokeWidth={DETALLE} />
      <circle cx="204" cy="140" r="8" fill={PALETA.amarillo} strokeWidth={DETALLE} />
    </>
  )
}

export function Helado() {
  return (
    <>
      <path d="M74 150 L182 150 L128 240 Z" fill={PALETA.naranja} />
      <path d="M128 240 L182 150 L128 150 Z" fill={SOMBRA.naranja} stroke="none" />
      <path d="M100 150 L146 202 M126 150 L162 174 M156 150 L172 162" fill="none" strokeWidth={DETALLE} />
      <path d="M110 202 L156 150 M90 178 L118 150 M76 156 L82 150" fill="none" strokeWidth={DETALLE} />
      <path d="M84 158 Q80 186 92 196 Q100 180 96 158 Z" fill={PALETA.rojo} />
      <circle cx="128" cy="132" r="56" fill={PALETA.rojo} />
      <circle cx="118" cy="122" r="46" fill={PALETA.rojo} stroke="none" />
      <path d="M156 100 A 56 56 0 0 1 156 164 A 46 46 0 0 0 156 100 Z" fill={SOMBRA.rojo} stroke="none" />
      <circle cx="128" cy="84" r="42" fill={SOMBRA.morado} />
      <circle cx="120" cy="76" r="34" fill={PALETA.morado} stroke="none" />
      <path d="M96 62 Q104 46 122 44" fill="none" stroke={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M136 44 L146 28" fill="none" stroke={SOMBRA.verde} strokeWidth={DETALLE} />
      <circle cx="132" cy="36" r="14" fill={PALETA.rojo} />
    </>
  )
}
