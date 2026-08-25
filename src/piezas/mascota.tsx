import type { ComponentType } from 'react'
import { DETALLE, PALETA, SOMBRA, TRAZO } from './estilo'
import { Lienzo } from './lienzo'

/**
 * El explorador: la criatura que acompaña al niño por el planeta. Está dibujada
 * con el mismo sistema que las piezas —lienzo 256, relleno plano, luz de arriba
 * a la izquierda— porque comparte pantalla con ellas.
 *
 * Es naranja y las piezas no lo son casi nunca: de los siete colores de la
 * paleta, el naranja solo aparece en cuatro de las cuarenta y dos piezas, así
 * que la mascota no se confunde con algo que haya que arrastrar.
 *
 * Tres poses y ni una más. `reposo` es la de estar; `senala` es la pista, y por
 * eso apunta con el brazo y no solo cambia de cara; `celebra` es el premio. Una
 * cuarta pose de ánimo se pensó y se descartó: implicaría que el juego sabe que
 * el niño va mal, y aquí no se falla.
 *
 * Nunca lleva nombre accesible. Cuando señala, la palabra que hace falta —«Aquí
 * va»— ya la dice el hueco al que apunta; repetirla en la mascota la diría dos
 * veces y en el orden equivocado.
 */

const CLARO = PALETA.naranja
const OSCURO = SOMBRA.naranja

/** Las manos y los pies, en blanco, para que se lean sobre el cuerpo naranja. */
const MANO = PALETA.blanco

function Cuerpo() {
  return (
    <>
      <ellipse cx="94" cy="224" rx="24" ry="15" fill={OSCURO} />
      <ellipse cx="162" cy="224" rx="24" ry="15" fill={OSCURO} />
      <path
        d="M128 50 C 186 50 214 96 214 148 C 214 200 176 226 128 226 C 80 226 42 200 42 148 C 42 96 70 50 128 50 Z"
        fill={OSCURO}
      />
      <path
        d="M128 50 C 168 50 190 84 190 134 C 190 184 158 208 118 208 C 78 208 54 182 54 140 C 54 92 84 50 128 50 Z"
        fill={CLARO}
        stroke="none"
      />
      <path d="M128 50 L128 34" fill="none" />
      <path
        d="M128 6 L134 20 L149 21 L138 31 L141 46 L128 38 L115 46 L118 31 L107 21 L122 20 Z"
        fill={PALETA.amarillo}
        strokeWidth={DETALLE}
      />
    </>
  )
}

function Reposo() {
  return (
    <>
      <Cuerpo />
      <path d="M42 156 L16 182" fill="none" />
      <path d="M214 156 L240 182" fill="none" />
      <circle cx="76" cy="166" r="11" fill={PALETA.rojo} stroke="none" />
      <circle cx="180" cy="166" r="11" fill={PALETA.rojo} stroke="none" />
      <circle cx="102" cy="132" r="21" fill={PALETA.blanco} />
      <circle cx="158" cy="132" r="21" fill={PALETA.blanco} />
      <circle cx="106" cy="136" r="9" fill={TRAZO} stroke="none" />
      <circle cx="162" cy="136" r="9" fill={TRAZO} stroke="none" />
      <path d="M108 172 Q128 192 148 172" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

function Senala() {
  return (
    <>
      <Cuerpo />
      <path d="M42 156 L16 182" fill="none" />
      {/* El brazo derecho apunta hacia fuera y arriba: es la pista. La mano se
          queda en 236 y no en 248 para que el trazo no se corte contra el borde
          del lienzo. */}
      <path d="M214 150 L232 164" fill="none" />
      <circle cx="236" cy="168" r="12" fill={MANO} />
      <circle cx="76" cy="166" r="11" fill={PALETA.rojo} stroke="none" />
      <circle cx="180" cy="166" r="11" fill={PALETA.rojo} stroke="none" />
      <circle cx="102" cy="132" r="21" fill={PALETA.blanco} />
      <circle cx="158" cy="132" r="21" fill={PALETA.blanco} />
      {/* Las pupilas corridas hacia la mano: mira adonde señala. */}
      <circle cx="110" cy="136" r="9" fill={TRAZO} stroke="none" />
      <circle cx="166" cy="136" r="9" fill={TRAZO} stroke="none" />
      <path d="M110 174 Q128 188 146 174" fill="none" strokeWidth={DETALLE} />
    </>
  )
}

function Celebra() {
  return (
    <>
      <Cuerpo />
      <path d="M44 132 L22 98" fill="none" />
      <path d="M212 132 L234 98" fill="none" />
      <circle cx="20" cy="92" r="12" fill={MANO} />
      <circle cx="236" cy="92" r="12" fill={MANO} />
      <circle cx="72" cy="164" r="12" fill={PALETA.rojo} stroke="none" />
      <circle cx="184" cy="164" r="12" fill={PALETA.rojo} stroke="none" />
      {/* Los ojos cerrados en arco: sonríe con toda la cara, no solo con la boca. */}
      <path d="M84 136 A 20 20 0 0 1 122 136" fill="none" />
      <path d="M138 136 A 20 20 0 0 1 176 136" fill="none" />
      <path d="M104 166 Q128 166 152 166 Q152 196 128 196 Q104 196 104 166 Z" fill={OSCURO} />
      <path
        d="M112 182 Q128 174 144 182 Q144 196 128 196 Q112 196 112 182 Z"
        fill={PALETA.rojo}
        stroke="none"
      />
    </>
  )
}

export type Pose = 'reposo' | 'senala' | 'celebra'

const POSES: Readonly<Record<Pose, ComponentType>> = {
  reposo: Reposo,
  senala: Senala,
  celebra: Celebra,
}

export function Mascota({ pose, className }: { pose: Pose; className?: string }) {
  const Dibujo = POSES[pose]
  return (
    <Lienzo className={className}>
      <Dibujo />
    </Lienzo>
  )
}
