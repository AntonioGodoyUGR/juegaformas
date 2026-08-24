import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from '../App'
import { ProveedorDeJuego } from '../estado/juego'
import { NIVELES, situacion } from '../lib/niveles'
import { CLAVE, type Guardado, porDefecto } from '../lib/progreso'
import { rutas } from '../rutas'
import { textosDe } from '../textos'

/**
 * El único premio del juego, visto desde fuera: qué pasa cuando un niño termina
 * un tablero y qué pasa cuando el tablero que termina era el último del nivel.
 *
 * Se prueba con `emparejar` porque terminar un tablero son toques y no
 * geometría: las otras dos mecánicas piden arrastres, y aquí lo que se está
 * probando no es la mecánica sino lo que viene después de ella.
 */

const textos = textosDe('es')

/** Las partidas que hay que completar para cerrar el primer nivel. */
const PARTIDAS = NIVELES.emparejar[0].partidas

/** Más que la celebración breve, para no tener que saber cuánto dura. */
const DE_SOBRA = 5000

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

afterEach(() => vi.useRealTimers())

/** Arranca la pantalla de juego con un progreso ya empezado. */
function montar(completadas: number) {
  const empezado: Guardado = {
    ...porDefecto('es'),
    completadas: { ...porDefecto('es').completadas, emparejar: completadas },
  }
  localStorage.setItem(CLAVE, JSON.stringify(empezado))

  render(
    <ProveedorDeJuego preferencias={['es']}>
      <MemoryRouter initialEntries={[rutas.partida('emparejar', 'espacio')]}>
        <App />
      </MemoryRouter>
    </ProveedorDeJuego>,
  )
}

const cartas = () => [...document.querySelectorAll<HTMLButtonElement>('[data-carta]')]

/** Qué se está celebrando ahora mismo en pantalla, si es que algo. */
const celebrando = () => document.querySelector('[data-celebracion]')?.getAttribute('data-celebracion')

/** Resuelve el tablero entero: las dos cartas de cada pieza, una pareja detrás de otra. */
function resolverTablero() {
  const piezas = [...new Set(cartas().map((carta) => carta.dataset.carta!.split('#')[0]))]

  for (const pieza of piezas) {
    for (const copia of [1, 2]) {
      // Se busca cada carta justo antes de tocarla: el tablero repinta después
      // de cada toque y el nodo de hace un momento ya no es el que está puesto.
      const carta = document.querySelector<HTMLElement>(`[data-carta="${pieza}#${copia}"]`)
      if (carta) fireEvent.click(carta)
    }
  }
}

/** Deja pasar la celebración breve. */
const esperar = () => act(() => void vi.advanceTimersByTime(DE_SOBRA))

/** Lo que ha quedado escrito en el progreso. */
const progreso = () => JSON.parse(localStorage.getItem(CLAVE)!) as Guardado

const seguir = () => screen.getByRole('button', { name: textos.celebracion.seguir })

test('resolver un tablero se celebra sin pedir nada a cambio', () => {
  montar(0)

  resolverTablero()

  expect(celebrando()).toBe('partida')
  expect(screen.getByText(textos.celebracion.partida)).toBeInTheDocument()
  // Nada que tocar: la breve se va sola, y un botón aquí sería un peaje entre
  // una partida y la siguiente.
  expect(screen.queryByRole('button', { name: textos.celebracion.seguir })).not.toBeInTheDocument()
})

test('la celebración breve se quita sola y detrás viene otro tablero', () => {
  montar(0)

  resolverTablero()
  esperar()

  expect(celebrando()).toBeUndefined()
  // Un tablero nuevo: están las seis cartas y ninguna resuelta de antes.
  expect(cartas()).toHaveLength(6)
  for (const carta of cartas()) expect(carta).toBeEnabled()
})

test('la partida se cuenta al terminarla, no al salir de la celebración', () => {
  // Un niño que cierra la aplicación mirando las estrellas no pierde la partida
  // que acaba de resolver.
  montar(4)

  resolverTablero()

  expect(progreso().completadas.emparejar).toBe(5)
})

test('la última partida del nivel abre una pantalla propia', () => {
  montar(PARTIDAS - 1)

  resolverTablero()
  esperar()

  expect(celebrando()).toBe('nivel')
  expect(screen.getByText(textos.celebracion.nivel)).toBeInTheDocument()
  // Pantalla propia quiere decir que debajo no hay tablero.
  expect(cartas()).toHaveLength(0)
})

test('la celebración de nivel espera al niño en vez de encadenar sola', () => {
  montar(PARTIDAS - 1)

  resolverTablero()
  esperar()
  esperar()

  expect(celebrando()).toBe('nivel')
})

test('completar el nivel lo sube en el progreso guardado', () => {
  montar(PARTIDAS - 1)

  resolverTablero()
  esperar()

  const completadas = progreso().completadas.emparejar
  expect(completadas).toBe(PARTIDAS)
  // El nivel no se guarda, se deriva: haber cerrado uno se ve en que la cuenta
  // de partidas hechas dentro del nivel vuelve a empezar.
  expect(situacion('emparejar', completadas).hechas).toBe(0)
})

test('la celebración de nivel se sigue con un solo toque', () => {
  montar(PARTIDAS - 1)

  resolverTablero()
  esperar()
  fireEvent.click(seguir())

  expect(celebrando()).toBeUndefined()
  expect(cartas()).toHaveLength(6)
})

test('el botón de seguir se lleva el foco: la pantalla ha cambiado entera', () => {
  // El tablero se ha ido y con él el botón que tenía el foco. Sin esto, quien
  // juega con teclado o con lector de pantalla se queda sin saber qué ha pasado.
  montar(PARTIDAS - 1)

  resolverTablero()
  esperar()

  expect(seguir()).toHaveFocus()
})

test('una partida cualquiera no dispara la celebración grande', () => {
  montar(0)

  resolverTablero()
  esperar()

  expect(celebrando()).toBeUndefined()
  expect(screen.queryByText(textos.celebracion.nivel)).not.toBeInTheDocument()
})
