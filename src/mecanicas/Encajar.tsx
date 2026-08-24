import { useState } from 'react'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { useTextos } from '../estado/juego'
import { crearTablero, estaEncajada, estaTerminado, soltar } from '../lib/encajar'
import type { Partida } from '../lib/partida'
import { SIN_PISTA, acertar, estaSenalado, fallar } from '../lib/pista'
import { Pieza } from '../piezas'
import { detectarHueco, useAnunciosDeArrastre, useSensoresDeArrastre } from './arrastre'
import { SENAL } from './senal'

/**
 * El tablero de `encajar`: los huecos arriba, las fichas abajo, y el dedo entre
 * medias. Las reglas están en `src/lib/encajar.ts`; esto solo traduce lo que
 * hace `@dnd-kit` a llamadas de allí.
 *
 * El tablero no se reinicia solo cuando cambia la partida: quien lo monta le
 * pone una `key`, que es lo que garantiza que no queden piezas encajadas de la
 * partida anterior.
 */
export function Encajar({ partida, alTerminar }: { partida: Partida; alTerminar: () => void }) {
  const textos = useTextos()
  const [tablero, setTablero] = useState(() => crearTablero(partida))
  const [arrastrada, setArrastrada] = useState<string | null>(null)
  const [pista, setPista] = useState(SIN_PISTA)

  const sensores = useSensoresDeArrastre()
  const accesibilidad = useAnunciosDeArrastre(textos.arrastre.instrucciones)

  function alSoltar(pieza: string, hueco: string | null) {
    setArrastrada(null)
    const resultado = soltar(tablero, pieza, hueco)
    if (!resultado.acierto) {
      // Lo que se señala tras varios fallos seguidos es el hueco de la pieza
      // que el niño acaba de intentar, que en `encajar` se llama igual que
      // ella. Señalarlo es todo lo que pasa: la pieza sigue en la bandeja y la
      // tiene que llevar él.
      setPista((anterior) => fallar(anterior, pieza))
      return
    }

    setPista(acertar)
    setTablero(resultado.tablero)
    if (estaTerminado(resultado.tablero)) alTerminar()
  }

  return (
    <DndContext
      sensors={sensores}
      collisionDetection={detectarHueco}
      accessibility={accesibilidad}
      onDragStart={({ active }) => setArrastrada(String(active.id))}
      // `over` es el hueco que ha ganado la detección, o `null` si la pieza se
      // ha soltado lejos de todos. Fallar es soltar y ya está: sin sonido, sin
      // mensaje y sin que el tablero se entere.
      onDragEnd={({ active, over }) => alSoltar(String(active.id), over ? String(over.id) : null)}
      onDragCancel={() => setArrastrada(null)}
    >
      <div className="flex h-full flex-col justify-center gap-8 p-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {tablero.huecos.map((pieza) => (
            <Hueco
              key={pieza.id}
              id={pieza.id}
              lleno={estaEncajada(tablero, pieza.id)}
              senal={
                estaSenalado(pista, pieza.id)
                  ? textos.pista.destino(textos.piezas[pieza.id])
                  : undefined
              }
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {tablero.fichas.map((pieza) => (
            <Ficha
              key={pieza.id}
              id={pieza.id}
              nombre={textos.piezas[pieza.id]}
              puesta={estaEncajada(tablero, pieza.id)}
            />
          ))}
        </div>
      </div>

      {/* La pieza en vuelo va en el `DragOverlay` para que no la recorte la
          bandeja y para que, al fallar, vuelva sola a su sitio con la animación
          que trae `@dnd-kit`: en silencio y sin decirle al niño que ha fallado. */}
      <DragOverlay>
        {arrastrada ? <Pieza id={arrastrada} className="size-28 sm:size-36" decorativa /> : null}
      </DragOverlay>
    </DndContext>
  )
}

/**
 * Un sitio del tablero donde va una pieza concreta. `senal` es cómo se llama
 * cuando la pista lo está señalando, y venir o no venir es lo que decide si
 * late: un hueco normal no tiene nombre porque su pieza ya está nombrada en la
 * bandeja, y uno señalado sí, porque ahora dice algo que no dice nadie más.
 */
function Hueco({ id, lleno, senal }: { id: string; lleno: boolean; senal?: string }) {
  // Un hueco ya lleno sale del sorteo: así una pieza soltada entre dos va al
  // que de verdad puede recibirla, y no al que le pilla más cerca y está
  // ocupado.
  const { setNodeRef, isOver } = useDroppable({ id, disabled: lleno })

  return (
    <div
      ref={setNodeRef}
      data-hueco={id}
      data-pista={senal ? 'true' : undefined}
      // El rol solo existe mientras la pista está puesta, y existe porque un
      // `div` sin rol es «genérico»: su `aria-label` se lo salta la mitad de
      // los lectores de pantalla. Un hueco normal no lo necesita, que no tiene
      // nada que decir.
      role={senal ? 'note' : undefined}
      aria-label={senal}
      className={`flex size-28 items-center justify-center rounded-3xl transition-colors sm:size-36 ${
        lleno ? 'bg-transparent' : isOver ? 'bg-purple-200' : 'bg-purple-100'
      } ${senal ? SENAL : ''}`}
    >
      {/* Mientras el hueco está vacío, la pieza que va en él también está en la
          bandeja con su nombre, y decirlo dos veces solo alarga. Cuando se
          encaja, la ficha desaparece y el hueco pasa a ser la pieza: entonces
          es él quien tiene que nombrarla. */}
      {lleno ? <Pieza id={id} className="size-full" /> : <Silueta id={id} />}
    </div>
  )
}

/**
 * La pieza en color de sombra: lo que le dice al niño cuál va en este hueco. Un
 * agujero es color de sombra, no un contorno vacío, igual que en el icono de la
 * mecánica.
 *
 * Se saca con un filtro sobre el mismo dibujo en vez de con una segunda versión
 * de cada pieza: cuarenta y dos dibujos duplicados se desincronizan el día que
 * alguien retoca uno, y un filtro no puede.
 */
function Silueta({ id }: { id: string }) {
  return <Pieza id={id} className="size-full opacity-20 [filter:brightness(0)]" decorativa />
}

/**
 * Una ficha de la bandeja. Cuando ya está encajada no se quita de la fila: se
 * deja el sitio vacío, porque si la bandeja se recoloca al acertar, la pieza
 * que el niño iba a coger a continuación se le mueve debajo del dedo.
 */
function Ficha({ id, nombre, puesta }: { id: string; nombre: string; puesta: boolean }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id, disabled: puesta })

  if (puesta) return <div className="size-28 sm:size-36" aria-hidden="true" />

  return (
    <button
      ref={setNodeRef}
      type="button"
      data-ficha={id}
      aria-label={nombre}
      // `touch-none` es obligatorio para arrastrar con el dedo: sin él, el
      // navegador se queda el gesto para hacer scroll y la pieza no se mueve.
      className={`size-28 touch-none sm:size-36 ${isDragging ? 'opacity-30' : ''}`}
      {...listeners}
      {...attributes}
    >
      <Pieza id={id} className="size-full" decorativa />
    </button>
  )
}
