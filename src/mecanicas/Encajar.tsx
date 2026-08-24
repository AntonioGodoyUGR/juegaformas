import { useMemo, useState } from 'react'
import {
  type Announcements,
  type CollisionDetection,
  type ScreenReaderInstructions,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useTextos } from '../estado/juego'
import { type Diana, crearTablero, estaEncajada, estaTerminado, huecoMasCercano, soltar } from '../lib/encajar'
import type { Partida } from '../lib/partida'
import { Pieza } from '../piezas'

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

  // Ocho píxeles antes de considerar que esto es un arrastre. Sin el margen,
  // un dedo que solo toca —y un dedo de cinco años nunca toca del todo quieto—
  // levantaría la pieza y la soltaría en el sitio, que se ve como un parpadeo.
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  )

  // Sin esto, `@dnd-kit` anuncia el arrastre con sus frases de fábrica, que
  // están en inglés: un juego en castellano que empieza a hablar en inglés en
  // cuanto se coge una pieza. Al soltar se distingue encajar de fallar porque
  // la pieza y su hueco comparten identificador.
  const anuncios = useMemo<Announcements>(
    () => ({
      onDragStart: () => textos.arrastre.cogida,
      onDragOver: ({ over }) =>
        over ? textos.arrastre.sobreHueco : textos.arrastre.fueraDeHueco,
      onDragEnd: ({ active, over }) =>
        over?.id === active.id ? textos.arrastre.encajada : textos.arrastre.devuelta,
      onDragCancel: () => textos.arrastre.devuelta,
    }),
    [textos],
  )

  const instrucciones = useMemo<ScreenReaderInstructions>(
    () => ({ draggable: textos.arrastre.instrucciones }),
    [textos],
  )

  function alSoltar(pieza: string, hueco: string | null) {
    setArrastrada(null)
    const resultado = soltar(tablero, pieza, hueco)
    if (!resultado.acierto) return

    setTablero(resultado.tablero)
    if (estaTerminado(resultado.tablero)) alTerminar()
  }

  return (
    <DndContext
      sensors={sensores}
      collisionDetection={detectarHueco}
      accessibility={{ announcements: anuncios, screenReaderInstructions: instrucciones }}
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
            <Hueco key={pieza.id} id={pieza.id} lleno={estaEncajada(tablero, pieza.id)} />
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
 * «Cerca es suficiente», traducido a lo que `@dnd-kit` espera. El criterio no
 * está aquí sino en `huecoMasCercano`, para poder probarlo sin navegador.
 */
const detectarHueco: CollisionDetection = ({ collisionRect, droppableContainers, droppableRects }) => {
  const dianas: Diana[] = []

  for (const contenedor of droppableContainers) {
    const rect = droppableRects.get(contenedor.id)
    if (!rect) continue
    dianas.push({
      id: String(contenedor.id),
      recuadro: { x: rect.left, y: rect.top, ancho: rect.width, alto: rect.height },
    })
  }

  const elegido = huecoMasCercano(
    {
      x: collisionRect.left,
      y: collisionRect.top,
      ancho: collisionRect.width,
      alto: collisionRect.height,
    },
    dianas,
  )

  return elegido === null ? [] : [{ id: elegido }]
}

/** Un sitio del tablero donde va una pieza concreta. */
function Hueco({ id, lleno }: { id: string; lleno: boolean }) {
  // Un hueco ya lleno sale del sorteo: así una pieza soltada entre dos va al
  // que de verdad puede recibirla, y no al que le pilla más cerca y está
  // ocupado.
  const { setNodeRef, isOver } = useDroppable({ id, disabled: lleno })

  return (
    <div
      ref={setNodeRef}
      data-hueco={id}
      className={`flex size-28 items-center justify-center rounded-3xl transition-colors sm:size-36 ${
        lleno ? 'bg-transparent' : isOver ? 'bg-purple-200' : 'bg-purple-100'
      }`}
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
