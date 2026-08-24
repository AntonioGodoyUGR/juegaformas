import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { ProveedorDeJuego } from '../estado/juego'
import { generarPartida } from '../lib/partida'
import { FALLOS_PARA_PISTA } from '../lib/pista'
import { textosDe } from '../textos'
import { Emparejar } from './Emparejar'

/**
 * El tablero de emparejar visto como lo usa un niño: tocar una carta, tocar
 * otra, y mirar qué pasa. Los dos modos se prueban en la misma pantalla, porque
 * son la misma pantalla.
 *
 * Aquí no hace falta maquetar nada —tocar no es geometría, a diferencia de
 * arrastrar—, pero sí controlar el reloj: lo que se ve depende de cuánto tiempo
 * lleva a la vista una pareja fallada.
 */

const textos = textosDe('es')

/** Más que la pausa del fallo, para no tener que saber cuánto es exactamente. */
const DE_SOBRA = 5000

afterEach(() => vi.useRealTimers())

function montar(bocaAbajo: boolean, alTerminar = () => {}) {
  vi.useFakeTimers()

  // `() => 0` fija el sorteo: siempre las mismas tres piezas, en el mismo orden.
  const partida = generarPartida('emparejar', 'espacio', 0, () => 0)

  render(
    <ProveedorDeJuego preferencias={['es']}>
      <Emparejar partida={partida} bocaAbajo={bocaAbajo} alTerminar={alTerminar} />
    </ProveedorDeJuego>,
  )

  return partida.piezas.map((pieza) => pieza.id)
}

/** Las dos cartas de una pieza, tal y como están puestas en el tablero. */
function cartasDe(pieza: string) {
  return [...document.querySelectorAll<HTMLElement>(`[data-carta^="${pieza}#"]`)]
}

const todasLasCartas = () => [...document.querySelectorAll<HTMLElement>('[data-carta]')]

const tocar = (carta: HTMLElement) => fireEvent.click(carta)

/** Deja pasar el rato que una pareja fallada se queda a la vista. */
const esperar = () => act(() => void vi.advanceTimersByTime(DE_SOBRA))

/** Cómo se llama ahora mismo una carta: su pieza si se ve, el reverso si no. */
const nombreDe = (carta: HTMLElement) => carta.getAttribute('aria-label')

describe('el tablero', () => {
  test('reparte dos cartas por pieza', () => {
    const piezas = montar(false)

    expect(todasLasCartas()).toHaveLength(6)
    for (const pieza of piezas) expect(cartasDe(pieza)).toHaveLength(2)
  })

  test('destapado, cada carta dice qué pieza es', () => {
    const piezas = montar(false)

    for (const pieza of piezas) {
      for (const carta of cartasDe(pieza)) expect(nombreDe(carta)).toBe(textos.piezas[pieza])
    }
  })

  test('boca abajo, ninguna carta cuenta lo que esconde', () => {
    montar(true)

    for (const carta of todasLasCartas()) expect(nombreDe(carta)).toBe(textos.cartaTapada)
    // Y tampoco lo cuenta el dibujo: no hay ni una pieza pintada en pantalla.
    expect(document.querySelectorAll('svg')).toHaveLength(0)
  })
})

describe('tocar cartas', () => {
  test('boca abajo, la carta tocada se descubre y las demás no', () => {
    const piezas = montar(true)
    const [tocada, gemela] = cartasDe(piezas[0])

    tocar(tocada)

    expect(nombreDe(tocada)).toBe(textos.piezas[piezas[0]])
    expect(nombreDe(gemela)).toBe(textos.cartaTapada)
    for (const carta of cartasDe(piezas[1])) expect(nombreDe(carta)).toBe(textos.cartaTapada)
  })

  test('la pareja acertada se queda a la vista y deja de responder', () => {
    const piezas = montar(true)
    const [una, otra] = cartasDe(piezas[0])

    tocar(una)
    tocar(otra)
    esperar()

    for (const carta of cartasDe(piezas[0])) {
      expect(nombreDe(carta)).toBe(textos.piezas[piezas[0]])
      expect(carta).toBeDisabled()
    }
  })

  test('la pareja fallada se vuelve a tapar sola', () => {
    const piezas = montar(true)
    const [una] = cartasDe(piezas[0])
    const [otra] = cartasDe(piezas[1])

    tocar(una)
    tocar(otra)

    expect(nombreDe(una)).toBe(textos.piezas[piezas[0]])
    expect(nombreDe(otra)).toBe(textos.piezas[piezas[1]])

    esperar()

    // Sin tener que tocar nada para seguir: el tablero se recoge solo.
    expect(nombreDe(una)).toBe(textos.cartaTapada)
    expect(nombreDe(otra)).toBe(textos.cartaTapada)
    expect(una).toBeEnabled()
  })

  test('fallar no suena, no avisa y no bloquea la partida', () => {
    // «Fallar no suena» del ticket, mirado desde la pantalla: ni un mensaje, ni
    // un aviso al lector de pantalla, ni una carta que se quede inservible.
    const piezas = montar(false)
    const [una] = cartasDe(piezas[0])
    const [otra] = cartasDe(piezas[1])

    tocar(una)
    tocar(otra)

    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()

    esperar()
    tocar(una)
    tocar(cartasDe(piezas[0])[1])

    expect(cartasDe(piezas[0])[0]).toBeDisabled()
  })

  test('mientras hay una pareja fallada a la vista no se descubre una tercera', () => {
    // Un niño toca rápido: sin esto acabaría con el tablero entero levantado.
    const piezas = montar(true)
    const tercera = cartasDe(piezas[2])[0]

    tocar(cartasDe(piezas[0])[0])
    tocar(cartasDe(piezas[1])[0])
    tocar(tercera)

    expect(nombreDe(tercera)).toBe(textos.cartaTapada)
  })

  test('al hacer la última pareja se acaba la partida, y solo una vez', () => {
    const acabadas = vi.fn()
    const piezas = montar(true, acabadas)

    for (const pieza of piezas) {
      expect(acabadas).not.toHaveBeenCalled()
      const [una, otra] = cartasDe(pieza)
      tocar(una)
      tocar(otra)
      if (pieza !== piezas.at(-1)) esperar()
    }

    esperar()
    expect(acabadas).toHaveBeenCalledTimes(1)
  })
})

describe('los dos modos se juegan igual', () => {
  // Lo mismo que prueban las reglas, pero desde el dedo: lo único que cambia
  // entre destapado y boca abajo es lo que se ve antes de tocar.
  test.each([false, true])('boca abajo=%s se resuelve con los mismos toques', (bocaAbajo) => {
    const acabadas = vi.fn()
    const piezas = montar(bocaAbajo, acabadas)

    for (const pieza of piezas) {
      const [una, otra] = cartasDe(pieza)
      tocar(una)
      tocar(otra)
    }

    expect(acabadas).toHaveBeenCalledTimes(1)
    for (const carta of todasLasCartas()) expect(carta).toBeDisabled()
  })
})

describe('la pista', () => {
  /** La carta que está señalada ahora mismo, si hay alguna. */
  const senalada = () => document.querySelector('[data-pista]')

  /** Falla una pareja entera y espera a que el tablero la recoja. */
  function fallarPareja(una: string, otra: string) {
    tocar(cartasDe(una)[0])
    tocar(cartasDe(otra)[0])
    esperar()
  }

  /** Se atasca: falla la misma pareja imposible tantas veces como se diga. */
  function atascarse(una: string, otra: string, veces = FALLOS_PARA_PISTA) {
    for (let i = 0; i < veces; i++) fallarPareja(una, otra)
  }

  test('una pareja fallada no es estar atascado', () => {
    const [pieza, otra] = montar(true)

    atascarse(pieza, otra, FALLOS_PARA_PISTA - 1)
    tocar(cartasDe(pieza)[0])

    expect(senalada()).toBeNull()
  })

  test('tras varias parejas falladas se señala la pareja de la carta levantada', () => {
    const [pieza, otra] = montar(true)

    atascarse(pieza, otra)
    tocar(cartasDe(pieza)[0])

    expect(senalada()).toBe(cartasDe(pieza)[1])
  })

  test('la pista dice dónde está la pareja, no cuál es', () => {
    // Boca abajo, la carta señalada sigue tapada: qué pieza esconde lo descubre
    // el niño al tocarla, que es justo el gesto que la pista no le quita.
    const [pieza, otra] = montar(true)

    atascarse(pieza, otra)
    tocar(cartasDe(pieza)[0])

    const marcada = cartasDe(pieza)[1]
    expect(nombreDe(marcada)).toBe(textos.pista.pareja(textos.cartaTapada))
    expect(nombreDe(marcada)).not.toContain(textos.piezas[pieza])
  })

  test('señalar no hace la pareja ni acaba la partida: la toca él', () => {
    const acabadas = vi.fn()
    const [pieza, otra] = montar(true, acabadas)

    atascarse(pieza, otra)
    tocar(cartasDe(pieza)[0])

    expect(cartasDe(pieza)[1]).toBeEnabled()
    expect(acabadas).not.toHaveBeenCalled()

    tocar(cartasDe(pieza)[1])
    for (const carta of cartasDe(pieza)) expect(carta).toBeDisabled()
  })

  test('mientras la pareja fallada está a la vista no se señala nada', () => {
    // Hay dos cartas levantadas y ninguna es la buena: señalar a cualquiera de
    // las dos sería mentir.
    const [pieza, otra] = montar(true)

    atascarse(pieza, otra)
    tocar(cartasDe(pieza)[0])
    tocar(cartasDe(otra)[0])

    expect(senalada()).toBeNull()
  })

  test('acertar borra la cuenta: hay que volver a atascarse', () => {
    const [pieza, otra, tercera] = montar(true)

    atascarse(pieza, otra, FALLOS_PARA_PISTA - 1)
    tocar(cartasDe(pieza)[0])
    tocar(cartasDe(pieza)[1])
    esperar()

    atascarse(otra, tercera, FALLOS_PARA_PISTA - 1)
    tocar(cartasDe(otra)[0])

    expect(senalada()).toBeNull()
  })
})
