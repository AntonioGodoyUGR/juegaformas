import { useMemo } from 'react'
import {
  type Announcements,
  type CollisionDetection,
  type ScreenReaderInstructions,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useTextos } from '../estado/juego'
import { type Diana, huecoMasCercano } from '../lib/cerca'

/**
 * Lo que dos mecánicas necesitan para arrastrar igual. `encajar` lleva piezas a
 * sus huecos y `ordenar` lleva eslabones a sus sitios, pero el gesto es el
 * mismo, y si cada una lo configura por su cuenta acaban comportándose distinto
 * sin que nadie lo haya decidido.
 *
 * Lo que no vive aquí son las reglas: quién entra dónde lo decide el fichero de
 * reglas de cada mecánica.
 */

/**
 * «Cerca es suficiente», traducido a lo que `@dnd-kit` espera. El criterio no
 * está aquí sino en `huecoMasCercano`, para poder probarlo sin navegador.
 */
export const detectarHueco: CollisionDetection = ({
  collisionRect,
  droppableContainers,
  droppableRects,
}) => {
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

/**
 * Los sensores del arrastre.
 *
 * Ocho píxeles antes de considerar que esto es un arrastre. Sin el margen, un
 * dedo que solo toca —y un dedo de cinco años nunca toca del todo quieto—
 * levantaría la pieza y la soltaría en el sitio, que se ve como un parpadeo.
 */
export function useSensoresDeArrastre() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  )
}

/**
 * Lo que se oye al arrastrar, en el idioma del juego.
 *
 * Sin esto, `@dnd-kit` anuncia el arrastre con sus frases de fábrica, que están
 * en inglés: un juego en castellano que empieza a hablar en inglés en cuanto se
 * coge una pieza. Al soltar se distingue acertar de fallar porque la pieza y su
 * sitio comparten identificador, que es la convención que siguen las dos
 * mecánicas que arrastran.
 *
 * `instrucciones` lo pone cada mecánica: es la única frase que cambia, porque es
 * la que dice qué hay que hacer con las piezas.
 */
export function useAnunciosDeArrastre(instrucciones: string) {
  const textos = useTextos()

  const announcements = useMemo<Announcements>(
    () => ({
      onDragStart: () => textos.arrastre.cogida,
      onDragOver: ({ over }) => (over ? textos.arrastre.sobreHueco : textos.arrastre.fueraDeHueco),
      onDragEnd: ({ active, over }) =>
        over?.id === active.id ? textos.arrastre.encajada : textos.arrastre.devuelta,
      onDragCancel: () => textos.arrastre.devuelta,
    }),
    [textos],
  )

  const screenReaderInstructions = useMemo<ScreenReaderInstructions>(
    () => ({ draggable: instrucciones }),
    [instrucciones],
  )

  return { announcements, screenReaderInstructions }
}
