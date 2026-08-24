import type { ComponentType } from 'react'
import { type Mecanica } from '../lib/dominio'
import { DETALLE, PALETA, SOMBRA, TRAZO } from '../piezas/estilo'
import { Lienzo } from '../piezas/lienzo'

/**
 * Un icono por mecánica, para el primer toque. Van en el mismo sistema de
 * estilo que las piezas —mismo lienzo, misma paleta, misma luz de arriba a la
 * izquierda— porque comparten pantalla con ellas dos segundos después.
 *
 * Cada icono enseña la mecánica en vez de simbolizarla: encajar es una pieza
 * sobre su hueco, emparejar son dos cosas iguales, ordenar son tres tamaños en
 * fila. Un niño de cinco años no lee «Emparejar», así que el dibujo es lo que
 * de verdad decide adónde va, y las palabras están para el adulto.
 *
 * Nunca llevan nombre accesible: el botón que los envuelve ya se llama como la
 * mecánica, y repetirlo solo lo diría dos veces.
 */

function Encajar() {
  return (
    <>
      {/* La estrella suelta, arriba y girada: se está cayendo hacia el hueco. */}
      <path d="M119 27 L134 48 L160 44 L145 65 L157 88 L132 80 L114 99 L114 73 L90 61 L115 53 Z" fill={SOMBRA.amarillo} />
      <path d="M113 21 L128 42 L154 38 L139 59 L151 82 L126 74 L108 93 L108 67 L84 55 L109 47 Z" fill={PALETA.amarillo} stroke="none" />
      <rect x="32" y="116" width="192" height="116" rx="18" fill={PALETA.azul} />
      <path d="M32 214 L224 214 Q224 232 206 232 L50 232 Q32 232 32 214 Z" fill={SOMBRA.azul} stroke="none" />
      {/* El hueco es la misma estrella sin girar y en el tono oscuro: un agujero
          es color de sombra, no un contorno vacío. */}
      <path d="M128 134 L139 161 L168 163 L146 182 L153 210 L128 194 L103 210 L110 182 L88 163 L117 161 Z" fill={SOMBRA.azul} />
    </>
  )
}

function Emparejar() {
  return (
    <>
      <rect x="140" y="46" width="92" height="134" rx="16" fill={PALETA.blanco} />
      <path d="M140 162 L232 162 L232 164 Q232 180 216 180 L156 180 Q140 180 140 164 Z" fill={SOMBRA.blanco} stroke="none" />
      <circle cx="186" cy="113" r="31" fill={PALETA.verde} strokeWidth={DETALLE} />
      <rect x="24" y="78" width="92" height="134" rx="16" fill={PALETA.blanco} />
      <path d="M24 194 L116 194 L116 196 Q116 212 100 212 L40 212 Q24 212 24 196 Z" fill={SOMBRA.blanco} stroke="none" />
      <circle cx="70" cy="145" r="31" fill={PALETA.verde} strokeWidth={DETALLE} />
    </>
  )
}

function Ordenar() {
  return (
    <>
      <rect x="32" y="156" width="48" height="56" rx="12" fill={PALETA.morado} />
      <path d="M66 156 Q80 156 80 168 L80 200 Q80 212 66 212 Z" fill={SOMBRA.morado} stroke="none" />
      <rect x="104" y="116" width="48" height="96" rx="12" fill={PALETA.morado} />
      <path d="M138 116 Q152 116 152 128 L152 200 Q152 212 138 212 Z" fill={SOMBRA.morado} stroke="none" />
      <rect x="176" y="72" width="48" height="140" rx="12" fill={PALETA.morado} />
      <path d="M210 72 Q224 72 224 84 L224 200 Q224 212 210 212 Z" fill={SOMBRA.morado} stroke="none" />
      {/* El suelo: sin él, tres barras sueltas no forman una fila. */}
      <path d="M24 216 L232 216" fill="none" stroke={TRAZO} />
    </>
  )
}

const ICONOS: Readonly<Record<Mecanica, ComponentType>> = {
  encajar: Encajar,
  emparejar: Emparejar,
  ordenar: Ordenar,
}

export function IconoDeMecanica({
  mecanica,
  className,
}: {
  mecanica: Mecanica
  className?: string
}) {
  const Icono = ICONOS[mecanica]
  return (
    <Lienzo className={className}>
      <Icono />
    </Lienzo>
  )
}
