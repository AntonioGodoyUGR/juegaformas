import { useCallback, useEffect, useRef } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'

/**
 * La barrera de los ajustes: hay que mantener pulsado. No es un gesto secreto
 * —el botón está a la vista y dice cómo se abre—, es un gesto que no se hace
 * sin querer. Un niño de cinco años toca; mantener el dedo quieto casi un
 * segundo sobre una esquina es justo lo que no hace mientras juega.
 *
 * Un botón normal con `onClick` no vale para esto: el toque no puede abrir
 * nada. Por eso esto no devuelve un componente sino los manejadores, y quien
 * los usa no pone `onClick` en ninguna parte.
 */

/**
 * Cuánto hay que aguantar. Suficiente para que no salga de un toque nervioso y
 * poco para que un adulto que ya sabe que hay que mantener no se pregunte si
 * está funcionando.
 */
export const PULSACION_LARGA = 800

export function usePulsacionLarga(alCumplirse: () => void) {
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined)

  const soltar = useCallback(() => {
    if (espera.current !== undefined) clearTimeout(espera.current)
    espera.current = undefined
  }, [])

  const apretar = useCallback(() => {
    // Ya contando: la tecla repite mientras se aguanta, y cada repetición
    // reiniciaría la cuenta y dejaría la barrera imposible de cruzar.
    if (espera.current !== undefined) return

    espera.current = setTimeout(() => {
      espera.current = undefined
      alCumplirse()
    }, PULSACION_LARGA)
  }, [alCumplirse])

  // Si la pantalla se va antes de que se cumpla el rato, no se abre nada.
  useEffect(() => soltar, [soltar])

  return {
    onPointerDown: apretar,
    onPointerUp: soltar,
    onPointerCancel: soltar,
    // El dedo que se desliza fuera del botón es un dedo que se ha arrepentido.
    onPointerLeave: soltar,
    // También con teclado, que es como lo abre quien no usa la pantalla táctil:
    // se aguanta la tecla igual que se aguanta el dedo.
    onKeyDown: (evento: KeyboardEvent<HTMLElement>) => {
      if (evento.key !== 'Enter' && evento.key !== ' ') return
      // El espacio hace bajar la página, y aquí lo que se está haciendo es
      // mantener pulsado un botón.
      evento.preventDefault()
      if (!evento.repeat) apretar()
    },
    onKeyUp: soltar,
    onBlur: soltar,
    // Mantener el dedo en un móvil saca el menú del sistema por encima. Sin
    // esto, la barrera de los ajustes se convierte en «copiar imagen».
    onContextMenu: (evento: MouseEvent<HTMLElement>) => evento.preventDefault(),
  }
}
