import { DETALLE, PALETA, SOMBRA, TRAZO } from '../estilo'

/**
 * Tema `animales`. Todos son cabezas: a 96px un cuerpo entero se convierte en
 * una mancha, y una cara se reconoce de un vistazo.
 *
 * Los ojos son siempre el mismo par: un círculo de trazo con un punto blanco
 * arriba a la izquierda, del lado por el que entra la luz. Cambiar el ojo de un
 * animal y no de los otros es lo primero que rompe la familia.
 */

export function Leon() {
  return (
    <>
      <circle cx="60" cy="60" r="27" fill={PALETA.naranja} />
      <circle cx="196" cy="60" r="27" fill={PALETA.naranja} />
      <circle cx="60" cy="60" r="13" fill={SOMBRA.naranja} strokeWidth={DETALLE} />
      <circle cx="196" cy="60" r="13" fill={SOMBRA.naranja} strokeWidth={DETALLE} />
      {/*
        La melena es un círculo con diez picos: los vértices están a radio 72 y
        cada arco de radio 23 abomba hacia fuera hasta unos 86. Dibujarla con
        diez círculos sueltos dejaría costuras dentro.
      */}
      <path
        d="M128 56 A 23 23 0 0 1 170 70 A 23 23 0 0 1 196 106 A 23 23 0 0 1 196 150 A 23 23 0 0 1 170 186 A 23 23 0 0 1 128 200 A 23 23 0 0 1 86 186 A 23 23 0 0 1 60 150 A 23 23 0 0 1 60 106 A 23 23 0 0 1 86 70 A 23 23 0 0 1 128 56 Z"
        fill={PALETA.naranja}
      />
      <circle cx="128" cy="130" r="56" fill={PALETA.amarillo} />
      <path d="M96 100 Q108 90 120 98" fill="none" strokeWidth={DETALLE} />
      <path d="M160 100 Q148 90 136 98" fill="none" strokeWidth={DETALLE} />
      <circle cx="106" cy="122" r="10" fill={TRAZO} />
      <circle cx="150" cy="122" r="10" fill={TRAZO} />
      <circle cx="102" cy="118" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="146" cy="118" r="4" fill={PALETA.blanco} stroke="none" />
      <ellipse cx="112" cy="162" rx="23" ry="17" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <ellipse cx="144" cy="162" rx="23" ry="17" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M114 142 L142 142 L128 156 Z" fill={PALETA.rojo} strokeWidth={DETALLE} />
      <path d="M128 156 L128 164" fill="none" strokeWidth={DETALLE} />
      <path d="M128 164 Q118 174 110 166" fill="none" strokeWidth={DETALLE} />
      <path d="M128 164 Q138 174 146 166" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Elefante() {
  return (
    <>
      <ellipse cx="52" cy="112" rx="44" ry="56" fill={SOMBRA.morado} />
      <ellipse cx="204" cy="112" rx="44" ry="56" fill={SOMBRA.morado} />
      <ellipse cx="56" cy="114" rx="26" ry="36" fill={PALETA.morado} stroke="none" />
      <ellipse cx="200" cy="114" rx="26" ry="36" fill={PALETA.morado} stroke="none" />
      <rect x="72" y="48" width="112" height="126" rx="46" fill={PALETA.morado} />
      <path d="M162 52 Q184 66 184 100 L184 128 Q184 160 162 172 Z" fill={SOMBRA.morado} stroke="none" />
      <path d="M100 168 Q88 192 98 210 Q110 194 112 170 Z" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M156 168 Q168 192 158 210 Q146 194 144 170 Z" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M110 144 L146 144 L146 200 Q146 222 172 222 L172 200 Q162 198 162 188 L162 144 Z" fill={PALETA.morado} />
      <path d="M112 160 L146 160 M112 176 L146 176 M113 192 L146 192" fill="none" strokeWidth={DETALLE} />
      <path d="M92 82 Q102 72 114 80" fill="none" strokeWidth={DETALLE} />
      <path d="M164 82 Q154 72 142 80" fill="none" strokeWidth={DETALLE} />
      <circle cx="102" cy="104" r="10" fill={TRAZO} />
      <circle cx="154" cy="104" r="10" fill={TRAZO} />
      <circle cx="98" cy="100" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="150" cy="100" r="4" fill={PALETA.blanco} stroke="none" />
    </>
  )
}

export function Jirafa() {
  return (
    <>
      <path d="M96 62 L92 32" fill="none" />
      <circle cx="90" cy="26" r="11" fill={SOMBRA.naranja} />
      <path d="M148 62 L152 32" fill="none" />
      <circle cx="154" cy="26" r="11" fill={SOMBRA.naranja} />
      <ellipse cx="62" cy="88" rx="22" ry="14" fill={SOMBRA.amarillo} />
      <ellipse cx="182" cy="88" rx="22" ry="14" fill={SOMBRA.amarillo} />
      <rect x="94" y="120" width="60" height="112" rx="14" fill={PALETA.amarillo} />
      <path d="M136 122 L136 232" fill="none" stroke={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <circle cx="112" cy="152" r="12" fill={PALETA.naranja} strokeWidth={DETALLE} />
      <circle cx="140" cy="184" r="11" fill={PALETA.naranja} strokeWidth={DETALLE} />
      <circle cx="110" cy="212" r="10" fill={PALETA.naranja} strokeWidth={DETALLE} />
      <ellipse cx="122" cy="96" rx="58" ry="44" fill={PALETA.amarillo} />
      <ellipse cx="112" cy="112" rx="34" ry="24" fill={SOMBRA.amarillo} strokeWidth={DETALLE} />
      <ellipse cx="100" cy="110" rx="4" ry="6" fill={TRAZO} stroke="none" />
      <ellipse cx="124" cy="110" rx="4" ry="6" fill={TRAZO} stroke="none" />
      <circle cx="98" cy="76" r="10" fill={TRAZO} />
      <circle cx="146" cy="76" r="10" fill={TRAZO} />
      <circle cx="94" cy="72" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="142" cy="72" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="160" cy="122" r="10" fill={PALETA.naranja} strokeWidth={DETALLE} />
    </>
  )
}

export function Oso() {
  return (
    <>
      <circle cx="64" cy="66" r="34" fill={PALETA.naranja} />
      <circle cx="192" cy="66" r="34" fill={PALETA.naranja} />
      <circle cx="64" cy="66" r="17" fill={SOMBRA.naranja} strokeWidth={DETALLE} />
      <circle cx="192" cy="66" r="17" fill={SOMBRA.naranja} strokeWidth={DETALLE} />
      <circle cx="128" cy="134" r="88" fill={PALETA.naranja} />
      <path d="M186 70 A 88 88 0 0 1 186 198 A 88 88 0 0 0 186 70 Z" fill={SOMBRA.naranja} stroke="none" />
      <path d="M92 108 Q104 98 116 106" fill="none" strokeWidth={DETALLE} />
      <path d="M164 108 Q152 98 140 106" fill="none" strokeWidth={DETALLE} />
      <circle cx="102" cy="128" r="11" fill={TRAZO} />
      <circle cx="154" cy="128" r="11" fill={TRAZO} />
      <circle cx="98" cy="123" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="150" cy="123" r="4" fill={PALETA.blanco} stroke="none" />
      <ellipse cx="128" cy="178" rx="46" ry="34" fill={PALETA.blanco} />
      <ellipse cx="128" cy="160" rx="17" ry="12" fill={TRAZO} stroke="none" />
      <path d="M128 172 L128 182" fill="none" strokeWidth={DETALLE} />
      <path d="M128 182 Q116 194 108 184" fill="none" strokeWidth={DETALLE} />
      <path d="M128 182 Q140 194 148 184" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Conejo() {
  return (
    <>
      <rect x="66" y="16" width="40" height="116" rx="20" transform="rotate(-13 86 74)" fill={SOMBRA.blanco} />
      <rect x="150" y="16" width="40" height="116" rx="20" transform="rotate(13 170 74)" fill={SOMBRA.blanco} />
      <rect x="76" y="30" width="20" height="88" rx="10" transform="rotate(-13 86 74)" fill={PALETA.rojo} stroke="none" />
      <rect x="160" y="30" width="20" height="88" rx="10" transform="rotate(13 170 74)" fill={PALETA.rojo} stroke="none" />
      <circle cx="128" cy="160" r="70" fill={SOMBRA.blanco} />
      <circle cx="120" cy="152" r="60" fill={PALETA.blanco} stroke="none" />
      <circle cx="104" cy="150" r="10" fill={TRAZO} />
      <circle cx="152" cy="150" r="10" fill={TRAZO} />
      <circle cx="100" cy="146" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="148" cy="146" r="4" fill={PALETA.blanco} stroke="none" />
      <path d="M116 176 L140 176 L128 188 Z" fill={PALETA.rojo} strokeWidth={DETALLE} />
      <path d="M128 188 L128 194" fill="none" strokeWidth={DETALLE} />
      <path d="M128 194 Q118 204 110 196" fill="none" strokeWidth={DETALLE} />
      <path d="M128 194 Q138 204 146 196" fill="none" strokeWidth={DETALLE} />
      <rect x="118" y="200" width="9" height="16" rx="3" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <rect x="129" y="200" width="9" height="16" rx="3" fill={PALETA.blanco} strokeWidth={DETALLE} />
      <path d="M84 168 L58 160 M84 180 L58 182" fill="none" strokeWidth={DETALLE} />
      <path d="M172 168 L198 160 M172 180 L198 182" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

export function Zorro() {
  return (
    <>
      <path d="M40 40 L96 66 L60 108 Z" fill={PALETA.naranja} />
      <path d="M216 40 L160 66 L196 108 Z" fill={PALETA.naranja} />
      <path d="M52 54 L84 69 L64 92 Z" fill={SOMBRA.naranja} strokeWidth={DETALLE} />
      <path d="M204 54 L172 69 L192 92 Z" fill={SOMBRA.naranja} strokeWidth={DETALLE} />
      <path d="M36 92 Q128 56 220 92 L128 218 Z" fill={PALETA.naranja} />
      <path d="M128 78 Q188 76 220 92 L128 218 Z" fill={SOMBRA.naranja} stroke="none" />
      <path d="M78 106 Q94 100 106 108" fill="none" strokeWidth={DETALLE} />
      <path d="M178 106 Q162 100 150 108" fill="none" strokeWidth={DETALLE} />
      <circle cx="94" cy="126" r="10" fill={TRAZO} />
      <circle cx="162" cy="126" r="10" fill={TRAZO} />
      <circle cx="90" cy="122" r="4" fill={PALETA.blanco} stroke="none" />
      <circle cx="158" cy="122" r="4" fill={PALETA.blanco} stroke="none" />
      <path d="M92 148 L164 148 L128 218 Z" fill={PALETA.blanco} />
      <ellipse cx="128" cy="196" rx="14" ry="11" fill={TRAZO} stroke="none" />
      <path d="M108 166 Q128 178 148 166" fill="none" strokeWidth={DETALLE} />
    </>
  )
}
