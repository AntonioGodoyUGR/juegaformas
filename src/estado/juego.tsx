import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { guardar, elegirIdioma, leer, porDefecto, reiniciar as limpiar } from '../lib/progreso'
import type { Guardado, Idioma } from '../lib/progreso'
import { textosDe } from '../textos'
import type { Textos } from '../textos'

/**
 * El estado vivo del juego: el guardado en memoria y los textos del idioma
 * activo. `src/lib/progreso.ts` sigue siendo lógica pura; aquí solo se le pone
 * React encima y se persiste cada cambio.
 */
type Juego = {
  readonly guardado: Guardado
  readonly textos: Textos
  cambiarIdioma: (idioma: Idioma) => void
  actualizar: (cambio: (estado: Guardado) => Guardado) => void
  /** Borrarlo todo. Lo pide un adulto desde ajustes, y no se puede deshacer. */
  reiniciar: () => void
}

/**
 * Sin proveedor se juega en castellano y no se guarda nada. Es lo que hace
 * falta para pintar una pieza suelta en un test o en una pantalla de ejemplo:
 * un componente que se cae por no estar envuelto es una forma cara de avisar de
 * algo que el `main.tsx` ya garantiza.
 */
const SIN_PROVEEDOR: Juego = {
  guardado: porDefecto(),
  textos: textosDe('es'),
  cambiarIdioma: () => {},
  actualizar: () => {},
  reiniciar: () => {},
}

const Contexto = createContext<Juego>(SIN_PROVEEDOR)

/**
 * `almacen` y `preferencias` se inyectan por la misma razón que en
 * `progreso.ts`: para poder probar el arranque —qué idioma sale de fábrica en
 * un dispositivo en inglés— sin tocar el navegador de verdad.
 */
export function ProveedorDeJuego({
  children,
  almacen = localStorage,
  preferencias = navigator.languages,
}: {
  children: ReactNode
  almacen?: Storage
  preferencias?: readonly string[]
}) {
  // El idioma del aparato se mira una vez, al arrancar, y se recuerda: es el
  // que hay que volver a poner al reiniciar, porque reiniciar es dejar la
  // tablet como recién instalada y no como la dejó el último adulto.
  const [delAparato] = useState(() => elegirIdioma(preferencias))
  const [guardado, setGuardado] = useState(() => leer(almacen, delAparato))

  useEffect(() => {
    guardar(guardado, almacen)
    // El idioma del documento manda en cómo pronuncia un lector de pantalla y
    // en cómo parte las palabras el navegador, así que sigue al elegido.
    document.documentElement.lang = guardado.idioma
  }, [guardado, almacen])

  const actualizar = useCallback((cambio: (estado: Guardado) => Guardado) => {
    setGuardado(cambio)
  }, [])

  // Cambiar de idioma es cambiar un campo del guardado, no recargar nada: el
  // resto del progreso viaja intacto en el mismo objeto.
  const cambiarIdioma = useCallback((idioma: Idioma) => {
    setGuardado((estado) => (estado.idioma === idioma ? estado : { ...estado, idioma }))
  }, [])

  // Se borra el almacenamiento y además se pone el estado limpio en memoria: el
  // efecto de arriba lo volverá a escribir enseguida, y eso es justo lo que se
  // quiere —lo que queda guardado es un juego recién instalado, no un hueco—.
  const reiniciar = useCallback(() => {
    setGuardado(limpiar(almacen, delAparato))
  }, [almacen, delAparato])

  const valor = useMemo<Juego>(
    () => ({ guardado, textos: textosDe(guardado.idioma), cambiarIdioma, actualizar, reiniciar }),
    [guardado, cambiarIdioma, actualizar, reiniciar],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useJuego(): Juego {
  return useContext(Contexto)
}

/** Atajo para lo que piden casi todas las vistas: solo las palabras. */
export function useTextos(): Textos {
  return useContext(Contexto).textos
}
