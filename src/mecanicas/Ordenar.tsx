import { useState } from 'react'
import type { CSSProperties } from 'react'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { Guia } from '../componentes/Guia'
import { useSonido } from '../estado/audio'
import { useTextos } from '../estado/juego'
import {
  type Criterio,
  crearTablero,
  estaColocado,
  estaTerminado,
  secuencia,
  soltar,
} from '../lib/ordenar'
import type { Partida } from '../lib/partida'
import { SIN_PISTA, acertar, estaSenalado, fallar, hayPista } from '../lib/pista'
import { Pieza } from '../piezas'
import { detectarHueco, useAnunciosDeArrastre, useSensoresDeArrastre } from './arrastre'
import { SENAL } from './senal'

/**
 * El tablero de `ordenar`: la secuencia arriba, los eslabones sueltos abajo. Las
 * reglas están en `src/lib/ordenar.ts`; esto solo traduce lo que hace `@dnd-kit`
 * a llamadas de allí.
 *
 * **Cómo sabe un niño de cinco años hacia dónde va la secuencia.** Los sitios
 * vacíos crecen del inicio al fin, como una escalera. Sin esa rampa, ordenar de
 * pequeño a grande y de grande a pequeño son igual de razonables y el tablero
 * tendría dos soluciones: una que cuenta y otra que no, sin nada en pantalla que
 * las distinga. La rampa lo dice sin una palabra, que es como hay que decirlo a
 * quien todavía no lee.
 *
 * Lo que la rampa no hace es resolverlo: el sitio está vacío, no lleva la
 * silueta de lo que va dentro como en `encajar`. Allí la silueta es la pista de
 * qué pieza es; aquí sería la respuesta entera.
 */
export function Ordenar({
  partida,
  criterio,
  alTerminar,
}: {
  partida: Partida
  criterio: Criterio
  alTerminar: () => void
}) {
  const textos = useTextos()
  const sonar = useSonido()
  const [tablero, setTablero] = useState(() => crearTablero(partida, criterio))
  const [arrastrado, setArrastrado] = useState<number | null>(null)
  const [pista, setPista] = useState(SIN_PISTA)

  const sensores = useSensoresDeArrastre()
  const accesibilidad = useAnunciosDeArrastre(textos.orden.instrucciones[tablero.criterio])

  const total = tablero.eslabones.length
  const nombreDePieza = textos.piezas[tablero.pieza]
  const escala = escalaDeEscalera(total)

  /** Cómo se llama un eslabón para quien no ve la pantalla. */
  function nombrar(grado: number) {
    return tablero.criterio === 'tamano'
      ? textos.orden.tamano(nombreDePieza, grado, total)
      : textos.orden.cantidad(nombreDePieza, grado)
  }

  /**
   * Cómo se llama un sitio: por su número mientras está vacío y por su eslabón
   * en cuanto se llena. Señalado, además dice que es ahí, porque un sitio que
   * late no se oye.
   */
  function etiquetar(sitio: number) {
    if (estaColocado(tablero, sitio)) return nombrar(sitio)

    const vacio = textos.orden.sitio(sitio, total)
    return estaSenalado(pista, String(sitio)) ? textos.pista.destino(vacio) : vacio
  }

  function alSoltar(grado: number, sitio: number | null) {
    setArrastrado(null)
    const resultado = soltar(tablero, grado, sitio)
    if (!resultado.acierto) {
      // El sitio que se señalará si los fallos siguen es el del eslabón que el
      // niño acaba de intentar colocar, caiga donde caiga el que ha soltado.
      setPista((anterior) => fallar(anterior, String(grado)))
      return
    }

    setPista(acertar)
    sonar('acierto')
    setTablero(resultado.tablero)
    if (estaTerminado(resultado.tablero)) alTerminar()
  }

  return (
    <DndContext
      sensors={sensores}
      collisionDetection={detectarHueco}
      accessibility={accesibilidad}
      onDragStart={({ active }) => setArrastrado(Number(active.id))}
      // `over` es el sitio que ha ganado la detección, o `null` si el eslabón se
      // ha soltado lejos de todos. Colocarlo donde no va es soltar y ya está: el
      // eslabón se vuelve a su sitio en silencio.
      onDragEnd={({ active, over }) => alSoltar(Number(active.id), over ? Number(over.id) : null)}
      onDragCancel={() => setArrastrado(null)}
    >
      {/* Los tamaños de esta mecánica van en `em` y no en clases fijas porque
          son una escala, no tres medidas sueltas: con el `em` atado aquí, toda
          la escalera crece o se encoge de golpe y sigue proporcionada. */}
      <div className="relative flex h-full flex-col justify-center gap-8 p-4" style={escala}>
        {/* Una secuencia es una lista ordenada, y decirlo con `ol` es lo que
            hace que un lector de pantalla la recorra como lo que es. */}
        <ol className="flex list-none flex-wrap items-end justify-center gap-3 sm:gap-5">
          {secuencia(tablero).map((sitio) => (
            <Sitio
              key={sitio}
              sitio={sitio}
              lleno={estaColocado(tablero, sitio)}
              senalado={estaSenalado(pista, String(sitio))}
              nombre={etiquetar(sitio)}
            >
              <Dibujo criterio={tablero.criterio} pieza={tablero.pieza} grado={sitio} />
            </Sitio>
          ))}
        </ol>

        <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
          {tablero.eslabones.map((eslabon) => (
            <Ficha
              key={eslabon.id}
              grado={eslabon.grado}
              lado={ladoDeFicha(tablero.criterio, eslabon.grado, total)}
              nombre={nombrar(eslabon.grado)}
              puesto={estaColocado(tablero, eslabon.grado)}
            >
              <Dibujo criterio={tablero.criterio} pieza={tablero.pieza} grado={eslabon.grado} />
            </Ficha>
          ))}
        </div>

        <Guia senalando={hayPista(pista)} />
      </div>

      {/* El eslabón en vuelo va en el `DragOverlay` para que no lo recorte la
          bandeja y para que, al fallar, vuelva solo a su sitio con la animación
          que trae `@dnd-kit`: en silencio. */}
      <DragOverlay>
        {arrastrado === null ? null : (
          // El `DragOverlay` es hermano de la escalera, no hijo: sin volver a
          // darle el `em` de aquí, el eslabón cambiaría de tamaño al levantarlo.
          <div
            style={{
              ...escala,
              ...cuadrado(ladoDeFicha(tablero.criterio, arrastrado, total)),
            }}
          >
            <Dibujo criterio={tablero.criterio} pieza={tablero.pieza} grado={arrastrado} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

/**
 * La escalera: cuánto mide el sitio de cada grado, en `em`.
 *
 * `PASO` es más de la mitad de `MENOR` a propósito. Dos eslabones seguidos
 * tienen que verse distintos de un vistazo y desde la distancia a la que un niño
 * sujeta una tablet; una escalera de peldaños finos es un tablero que se falla
 * por no distinguirlos, no por no entenderlos.
 */
const MENOR = 3.5
const PASO = 2

const ladoDe = (grado: number) => MENOR + (grado - 1) * PASO

const cuadrado = (lado: number) => ({ width: `${lado}em`, height: `${lado}em` })

/** Lo que separa dos eslabones en pantalla grande, en píxeles. Es el `gap-5` de las filas. */
const SEPARACION = 20

/**
 * De cuánto es el `em` del que cuelga toda la escalera cuando la secuencia tiene
 * `total` peldaños.
 *
 * Esta mecánica es la que peor lleva crecer, y por eso su dificultad se queda en
 * cinco: la escalera no suma peldaños iguales, los suma cada vez más grandes. La
 * bandeja de `cantidad` —donde todos los eslabones ocupan lo que el mayor— pide
 * `total × ladoDe(total)` de ancho, que con cinco son cincuenta y siete veces el
 * `em` y con seis serían ochenta y dos.
 *
 * Así que el `em` se calcula en vez de fijarse: se parte del de siempre y se
 * baja hasta lo que quepa a lo ancho y a lo alto. Con tres o cuatro peldaños no
 * cambia nada; con cinco, la escalera entera se encoge de una pieza, que es
 * justo lo que no se puede hacer con clases fijas.
 */
function escalaDeEscalera(total: number): CSSProperties {
  // Lo ancho lo pone la bandeja de `cantidad`, que es la fila más larga de las
  // dos que hay; lo alto, las dos filas de eslabones del tamaño del mayor.
  const anchoEm = total * ladoDe(total)
  const altoEm = 2 * ladoDe(total)

  const cabeAncho = `(94vw - ${(total - 1) * SEPARACION}px) / ${anchoEm}`
  const cabeAlto = `(78vh - 64px) / ${altoEm}`

  return { fontSize: `min(1.35rem, ${cabeAncho}, ${cabeAlto})` }
}

/**
 * Cuánto ocupa un eslabón en la bandeja.
 *
 * En `tamano` ocupa lo suyo, que es justo lo que hay que comparar. En `cantidad`
 * todos ocupan lo mismo —lo que ocupa el mayor— porque si la ficha creciera con
 * la cantidad, el niño emparejaría tamaños con la escalera y no llegaría a
 * contar nada.
 */
function ladoDeFicha(criterio: Criterio, grado: number, total: number): number {
  return ladoDe(criterio === 'tamano' ? grado : total)
}

/** Un sitio de la secuencia. Vacío es un hueco de color; lleno, el eslabón. */
function Sitio({
  sitio,
  lleno,
  senalado,
  nombre,
  children,
}: {
  sitio: number
  lleno: boolean
  senalado: boolean
  nombre: string
  children: React.ReactNode
}) {
  // Un sitio ya lleno sale del sorteo: así un eslabón soltado entre dos va al
  // que de verdad puede recibirlo.
  const { setNodeRef, isOver } = useDroppable({ id: String(sitio), disabled: lleno })

  return (
    <li
      ref={setNodeRef}
      data-sitio={sitio}
      data-pista={senalado ? 'true' : undefined}
      aria-label={nombre}
      style={cuadrado(ladoDe(sitio))}
      className={`flex items-center justify-center rounded-3xl transition-colors ${
        lleno ? 'bg-transparent' : isOver ? 'bg-suelo' : 'bg-hondo'
      } ${senalado ? SENAL : ''}`}
    >
      {lleno ? children : null}
    </li>
  )
}

/**
 * Un eslabón de la bandeja. Cuando ya está colocado se deja el sitio vacío en
 * vez de quitarlo, porque si la bandeja se recoloca al acertar, el eslabón que
 * el niño iba a coger a continuación se le mueve debajo del dedo.
 */
function Ficha({
  grado,
  lado,
  nombre,
  puesto,
  children,
}: {
  grado: number
  lado: number
  nombre: string
  puesto: boolean
  children: React.ReactNode
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: String(grado),
    disabled: puesto,
  })

  if (puesto) return <div style={cuadrado(lado)} aria-hidden="true" />

  return (
    <button
      ref={setNodeRef}
      type="button"
      data-eslabon={grado}
      aria-label={nombre}
      style={cuadrado(lado)}
      // `touch-none` es obligatorio para arrastrar con el dedo: sin él, el
      // navegador se queda el gesto para hacer scroll y la pieza no se mueve.
      className={`touch-none ${isDragging ? 'opacity-30' : ''}`}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  )
}

/**
 * El eslabón dibujado. Es lo único que distingue los dos criterios en pantalla:
 * la misma pieza más grande, o la misma pieza más veces.
 *
 * Los dibujos van `decorativa` porque quien los contiene —el sitio o la ficha—
 * ya se llama como el eslabón entero. Sin esto, un eslabón de tres se anunciaría
 * como la misma pieza tres veces seguidas.
 */
function Dibujo({ criterio, pieza, grado }: { criterio: Criterio; pieza: string; grado: number }) {
  if (criterio === 'tamano') return <Pieza id={pieza} className="size-full" decorativa />

  return (
    <div className="flex size-full flex-wrap content-center items-center justify-center gap-[0.15em]">
      {Array.from({ length: grado }, (_, i) => (
        <Pieza key={i} id={pieza} className="size-[2em] shrink-0" decorativa />
      ))}
    </div>
  )
}
