import { type Mecanica } from '../lib/dominio'
import { DETALLE, PALETA, SOMBRA } from '../piezas/estilo'
import { Lienzo } from '../piezas/lienzo'
import { IconoDeMecanica } from './mecanicas'

/**
 * Cada mecánica es un planeta, y el icono de la mecánica es lo que hay en él.
 *
 * Es decorado, no progresión: los tres están siempre ahí, siempre iguales,
 * siempre entrables. El ADR-0001 rechaza los bloqueos de contenido, así que un
 * planeta no puede estar apagado ni tener candado; si algún día uno se viera
 * distinto de otro, sería un error, no una función.
 *
 * Un color por mecánica, tomado del icono que lleva dentro: el hueco de Encajar
 * es azul, las fichas de Emparejar son verdes, las barras de Ordenar son
 * moradas. Así el planeta y su icono son la misma cosa vista de lejos y de
 * cerca, que es lo que hace que un niño de cinco años los distinga de un
 * vistazo sin leer los rótulos.
 */

const COLORES: Readonly<Record<Mecanica, { claro: string; oscuro: string }>> = {
  encajar: { claro: PALETA.azul, oscuro: SOMBRA.azul },
  emparejar: { claro: PALETA.verde, oscuro: SOMBRA.verde },
  ordenar: { claro: PALETA.morado, oscuro: SOMBRA.morado },
}

export function PlanetaDeMecanica({
  mecanica,
  className,
}: {
  mecanica: Mecanica
  className?: string
}) {
  const { claro, oscuro } = COLORES[mecanica]
  return (
    <div className={`relative ${className ?? ''}`}>
      <Lienzo className="w-full">
        <circle cx="128" cy="128" r="118" fill={oscuro} />
        <circle cx="118" cy="118" r="108" fill={claro} stroke="none" />
        <circle cx="52" cy="76" r="15" fill={oscuro} strokeWidth={DETALLE} />
        <circle cx="206" cy="176" r="11" fill={oscuro} strokeWidth={DETALLE} />
        <circle cx="66" cy="192" r="9" fill={oscuro} strokeWidth={DETALLE} />
        {/*
          El claro blanco donde se posa el icono. Sin él, un icono de seis
          colores encima de un planeta de dos se lee como una mancha; encima del
          blanco se lee como un dibujo.
        */}
        <circle cx="128" cy="128" r="86" fill={PALETA.blanco} strokeWidth={DETALLE} />
      </Lienzo>
      {/*
        El icono va superpuesto y no dentro del mismo lienzo porque el trazo no
        escala: `vectorEffect="non-scaling-stroke"` mide en píxeles de pantalla,
        así que un grupo reducido al 62% saldría con el contorno más gordo de lo
        que le toca. Dos lienzos, dos escalas, mismo grosor.
      */}
      <div className="absolute top-[19%] left-[19%] w-[62%]">
        <IconoDeMecanica mecanica={mecanica} className="w-full" />
      </div>
    </div>
  )
}
