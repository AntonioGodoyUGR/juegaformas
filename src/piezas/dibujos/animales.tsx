import { PALETA, TRAZO } from '../estilo'

/**
 * Tema `animales`. Todos son cabezas: a 96px un cuerpo entero se convierte en
 * una mancha, y una cara se reconoce de un vistazo.
 */

export function Leon() {
  return (
    <>
      <circle cx="70" cy="70" r="24" fill={PALETA.naranja} />
      <circle cx="186" cy="70" r="24" fill={PALETA.naranja} />
      <circle cx="128" cy="132" r="94" fill={PALETA.naranja} />
      <circle cx="128" cy="136" r="58" fill={PALETA.amarillo} />
      <circle cx="106" cy="124" r="9" fill={TRAZO} />
      <circle cx="150" cy="124" r="9" fill={TRAZO} />
      <path d="M112 152 L144 152 L128 170 Z" fill={PALETA.rojo} />
    </>
  )
}

export function Elefante() {
  return (
    <>
      <ellipse cx="56" cy="118" rx="44" ry="54" fill={PALETA.morado} />
      <ellipse cx="200" cy="118" rx="44" ry="54" fill={PALETA.morado} />
      <rect x="72" y="56" width="112" height="118" rx="46" fill={PALETA.morado} />
      <path
        d="M110 150 L146 150 L146 202 Q146 220 168 220 L168 200 Q162 198 162 188 L162 150 Z"
        fill={PALETA.morado}
      />
      <circle cx="102" cy="106" r="9" fill={TRAZO} />
      <circle cx="154" cy="106" r="9" fill={TRAZO} />
    </>
  )
}

export function Jirafa() {
  return (
    <>
      <path d="M112 60 L104 34" fill="none" />
      <path d="M144 60 L152 34" fill="none" />
      <circle cx="102" cy="30" r="12" fill={PALETA.naranja} />
      <circle cx="154" cy="30" r="12" fill={PALETA.naranja} />
      <rect x="106" y="108" width="44" height="126" fill={PALETA.amarillo} />
      <ellipse cx="128" cy="90" rx="50" ry="38" fill={PALETA.amarillo} />
      <circle cx="110" cy="82" r="8" fill={TRAZO} />
      <circle cx="146" cy="82" r="8" fill={TRAZO} />
      <circle cx="120" cy="150" r="12" fill={PALETA.naranja} />
      <circle cx="140" cy="198" r="12" fill={PALETA.naranja} />
    </>
  )
}

export function Oso() {
  return (
    <>
      <circle cx="66" cy="70" r="30" fill={PALETA.naranja} />
      <circle cx="190" cy="70" r="30" fill={PALETA.naranja} />
      <circle cx="128" cy="140" r="88" fill={PALETA.naranja} />
      <ellipse cx="128" cy="168" rx="48" ry="36" fill={PALETA.blanco} />
      <circle cx="100" cy="118" r="9" fill={TRAZO} />
      <circle cx="156" cy="118" r="9" fill={TRAZO} />
      <ellipse cx="128" cy="152" rx="15" ry="11" fill={TRAZO} />
    </>
  )
}

export function Conejo() {
  return (
    <>
      <rect
        x="86"
        y="18"
        width="34"
        height="104"
        rx="17"
        fill={PALETA.blanco}
        transform="rotate(-12 103 70)"
      />
      <rect
        x="136"
        y="18"
        width="34"
        height="104"
        rx="17"
        fill={PALETA.blanco}
        transform="rotate(12 153 70)"
      />
      <circle cx="128" cy="166" r="68" fill={PALETA.blanco} />
      <circle cx="106" cy="154" r="9" fill={TRAZO} />
      <circle cx="150" cy="154" r="9" fill={TRAZO} />
      <path d="M116 178 L140 178 L128 192 Z" fill={PALETA.rojo} />
    </>
  )
}

export function Zorro() {
  return (
    <>
      <path d="M52 34 L104 90 L38 106 Z" fill={PALETA.naranja} />
      <path d="M204 34 L152 90 L218 106 Z" fill={PALETA.naranja} />
      <path d="M36 92 Q128 56 220 92 L128 218 Z" fill={PALETA.naranja} />
      <path d="M128 218 L92 148 L164 148 Z" fill={PALETA.blanco} />
      <circle cx="94" cy="126" r="9" fill={TRAZO} />
      <circle cx="162" cy="126" r="9" fill={TRAZO} />
      <circle cx="128" cy="200" r="12" fill={TRAZO} />
    </>
  )
}
