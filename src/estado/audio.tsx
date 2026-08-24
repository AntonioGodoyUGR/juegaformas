import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MUDO, conHowler } from '../audio/reproductor'
import type { Efecto, Reproductor } from '../audio/reproductor'
import { useJuego } from './juego'

/**
 * El sonido, enchufado al progreso. El volumen es un campo del guardado desde el
 * ticket 02, así que aquí no se guarda nada nuevo: se mira lo que hay y se le
 * dice al reproductor.
 *
 * Sin proveedor no suena nada. Es lo que hace que los tests de las mecánicas y
 * de las pantallas —que montan `App` a pelo— no tengan que saber que el juego
 * tiene sonido, y también lo que hace que el sonido sea de verdad opcional: si
 * mañana hay que quitarlo, se quita el proveedor de `main.tsx`.
 */
const Contexto = createContext<Reproductor>(MUDO)

export function ProveedorDeAudio({
  children,
  reproductor,
}: {
  children: ReactNode
  /** Se inyecta para poder probar qué suena sin que suene nada. */
  reproductor?: Reproductor
}) {
  const { guardado } = useJuego()

  // Los ficheros se cargan una vez. El `ref` y no un `useMemo` porque un
  // `useMemo` puede recalcularse cuando le parezca, y volver a cargarlos sería
  // volver a bajar doscientos kilobytes.
  const actual = useRef<Reproductor>(undefined)
  if (!actual.current) actual.current = reproductor ?? conHowler()
  const suena = actual.current

  // Hasta que el niño no toca la pantalla no se puede reproducir nada: los
  // navegadores no dejan que una página empiece a sonar sola, y la que lo
  // intenta se queda con la música parada y sin forma de saberlo. El primer
  // toque llega enseguida, porque para jugar hay que elegir mecánica.
  const [haTocado, setHaTocado] = useState(false)

  useEffect(() => {
    if (haTocado) return

    const despertar = () => setHaTocado(true)
    document.addEventListener('pointerdown', despertar, { once: true })
    document.addEventListener('keydown', despertar, { once: true })

    return () => {
      document.removeEventListener('pointerdown', despertar)
      document.removeEventListener('keydown', despertar)
    }
  }, [haTocado])

  useEffect(() => {
    suena.volumen(guardado.volumen)
    // A volumen cero no es que no se oiga: es que no suena. El juego con el
    // sonido quitado tiene que ser exactamente el mismo juego.
    suena.musica(haTocado && guardado.volumen > 0)
  }, [suena, guardado.volumen, haTocado])

  return <Contexto.Provider value={suena}>{children}</Contexto.Provider>
}

/**
 * Lo que usa quien tiene algo que celebrar: `sonar('acierto')`. Solo los
 * efectos: la música y el volumen los lleva el proveedor mirando el guardado, y
 * una pantalla que pudiera pararlos por su cuenta sería una pantalla que puede
 * dejar el juego mudo sin que nadie lo haya pedido.
 */
export function useSonido(): (cual: Efecto) => void {
  return useContext(Contexto).efecto
}
