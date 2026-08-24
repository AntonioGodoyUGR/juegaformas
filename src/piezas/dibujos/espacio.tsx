import { DETALLE, PALETA, SOMBRA, TRAZO } from '../estilo'

/**
 * Tema `espacio`. Cada dibujo es un fragmento: el trazo y el lienzo los pone
 * `<Pieza>`, así que aquí solo van formas y rellenos.
 *
 * El orden de los elementos es el orden de pintado: lo que va detrás se escribe
 * primero. Las manchas de volumen llevan `stroke="none"` porque el contorno ya
 * lo pone la silueta que tienen debajo.
 */

export function Cohete() {
  return (
    <>
      {/* La llama primero: el casco la tapa por arriba y así no hace falta recortarla. */}
      <path d="M98 200 Q128 258 158 200 Z" fill={PALETA.naranja} />
      <path d="M112 202 Q128 236 144 202 Z" fill={PALETA.amarillo} stroke="none" />
      <path d="M118 194 L84 228 L84 162 Z" fill={PALETA.rojo} />
      <path d="M138 194 L172 228 L172 162 Z" fill={PALETA.rojo} />
      <path d="M138 194 L172 228 L172 196 Z" fill={SOMBRA.rojo} stroke="none" />
      <rect x="100" y="182" width="56" height="24" rx="8" fill={SOMBRA.blanco} />
      <path d="M128 20 C160 56 172 118 172 190 L84 190 C84 118 96 56 128 20 Z" fill={SOMBRA.blanco} />
      <path d="M128 20 C112 56 104 118 104 190 L84 190 C84 118 96 56 128 20 Z" fill={PALETA.blanco} stroke="none" />
      <path d="M128 20 C142 40 150 58 155 78 L101 78 C106 58 114 40 128 20 Z" fill={PALETA.rojo} />
      <circle cx="128" cy="124" r="30" fill={PALETA.blanco} />
      <circle cx="128" cy="124" r="21" fill={PALETA.azul} strokeWidth={DETALLE} />
      <path d="M117 115 A 15 15 0 0 0 114 127" fill="none" stroke={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M90 168 L166 168" fill="none" strokeWidth={DETALLE} />
      <circle cx="100" cy="180" r="4" fill={SOMBRA.blanco} strokeWidth={DETALLE} />
      <circle cx="156" cy="180" r="4" fill={SOMBRA.blanco} strokeWidth={DETALLE} />
    </>
  )
}

export function Planeta() {
  return (
    <>
      {/*
        El anillo son dos mitades de la misma elipse con los mismos extremos: la
        de arriba se pinta antes que el planeta y queda detrás, la de abajo
        después y queda delante. Es lo que hace que el anillo rodee y no cruce.
      */}
      <path d="M23 170 A 112 32 -20 0 1 233 94" fill="none" />
      <circle cx="128" cy="128" r="72" fill={SOMBRA.morado} />
      <circle cx="118" cy="118" r="62" fill={PALETA.morado} stroke="none" />
      <circle cx="104" cy="100" r="17" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="150" cy="84" r="9" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="150" cy="148" r="13" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <circle cx="92" cy="150" r="8" fill={SOMBRA.morado} strokeWidth={DETALLE} />
      <path d="M23 170 A 112 32 -20 0 0 233 94" fill="none" />
      <path d="M206 26 L211 40 L225 45 L211 50 L206 64 L201 50 L187 45 L201 40 Z" fill={PALETA.amarillo} strokeWidth={DETALLE} />
      <path d="M40 44 L44 55 L55 59 L44 63 L40 74 L36 63 L25 59 L36 55 Z" fill={PALETA.amarillo} strokeWidth={DETALLE} />
    </>
  )
}

export function Estrella() {
  return (
    <>
      <path d="M128 32 L152 96 L220 100 L166 142 L184 206 L128 168 L72 206 L90 142 L36 100 L104 96 Z" fill={SOMBRA.amarillo} />
      <path d="M123 49 L142 100 L190 102 L151 133 L164 181 L123 154 L82 181 L95 133 L56 102 L106 100 Z" fill={PALETA.amarillo} stroke="none" />
      <path d="M212 172 L216 184 L228 188 L216 192 L212 204 L208 192 L196 188 L208 184 Z" fill={PALETA.amarillo} strokeWidth={DETALLE} />
      <path d="M44 46 L47 56 L57 59 L47 62 L44 72 L41 62 L31 59 L41 56 Z" fill={PALETA.amarillo} strokeWidth={DETALLE} />
    </>
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
      <circle cx="68" cy="104" r="15" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="60" cy="146" r="11" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="86" cy="186" r="10" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="88" cy="68" r="9" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="98" cy="132" r="7" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <path d="M198 52 L203 66 L217 71 L203 76 L198 90 L193 76 L179 71 L193 66 Z" fill={PALETA.amarillo} strokeWidth={DETALLE} />
      <path d="M208 152 L211 162 L221 165 L211 168 L208 178 L205 168 L195 165 L205 162 Z" fill={PALETA.amarillo} strokeWidth={DETALLE} />
    </>
  )
}

export function Satelite() {
  return (
    <>
      <path d="M128 88 L128 44" fill="none" />
      <circle cx="128" cy="34" r="12" fill={PALETA.rojo} />
      <path d="M82 128 L100 128" fill="none" />
      <path d="M156 128 L174 128" fill="none" />
      <rect x="14" y="100" width="70" height="56" rx="8" fill={PALETA.azul} />
      <rect x="172" y="100" width="70" height="56" rx="8" fill={PALETA.azul} />
      <path d="M37 102 L37 154 M61 102 L61 154 M16 128 L82 128" fill="none" stroke={SOMBRA.azul} strokeWidth={DETALLE} />
      <path d="M195 102 L195 154 M219 102 L219 154 M174 128 L240 128" fill="none" stroke={SOMBRA.azul} strokeWidth={DETALLE} />
      <rect x="98" y="88" width="60" height="76" rx="14" fill={PALETA.blanco} />
      <path d="M138 90 L138 162" fill="none" strokeWidth={DETALLE} />
      <path d="M148 90 Q158 90 158 104 L158 148 Q158 162 148 162 Z" fill={SOMBRA.blanco} stroke="none" />
      <rect x="108" y="100" width="22" height="16" rx="5" fill={PALETA.amarillo} strokeWidth={DETALLE} />
      <path d="M108 130 L130 130 M108 144 L130 144" fill="none" strokeWidth={DETALLE} />
      <path d="M128 164 L128 178" fill="none" />
      <circle cx="128" cy="204" r="28" fill={PALETA.blanco} />
      <circle cx="128" cy="204" r="13" fill={PALETA.naranja} strokeWidth={DETALLE} />
    </>
  )
}

export function Astronauta() {
  return (
    <>
      <rect x="56" y="146" width="28" height="66" rx="12" fill={SOMBRA.blanco} />
      <path d="M70 232 C70 186 96 164 128 164 C160 164 186 186 186 232 Z" fill={SOMBRA.azul} />
      <path d="M70 232 C70 186 96 164 128 164 C128 164 118 190 118 232 Z" fill={PALETA.azul} stroke="none" />
      <rect x="96" y="190" width="46" height="30" rx="8" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <circle cx="108" cy="198" r="4" fill={PALETA.rojo} stroke="none" />
      <circle cx="120" cy="198" r="4" fill={PALETA.verde} stroke="none" />
      <path d="M104 210 L134 210" fill="none" strokeWidth={DETALLE} />
      <circle cx="128" cy="112" r="70" fill={SOMBRA.blanco} />
      <circle cx="122" cy="106" r="60" fill={PALETA.blanco} stroke="none" />
      <path d="M90 102 A 40 40 0 0 1 166 102 L166 124 A 38 38 0 0 1 90 124 Z" fill={TRAZO} />
      <path d="M104 96 A 30 30 0 0 1 122 84" fill="none" stroke={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M138 118 A 26 26 0 0 0 152 106" fill="none" stroke={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M180 74 L192 62" fill="none" />
      <circle cx="198" cy="56" r="10" fill={PALETA.amarillo} />
    </>
  )
}
