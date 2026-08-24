import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from '../App'
import type { Efecto, Reproductor } from '../audio/reproductor'
import { NIVELES } from '../lib/niveles'
import { CLAVE, type Guardado, porDefecto } from '../lib/progreso'
import { rutas } from '../rutas'
import { ProveedorDeAudio } from './audio'
import { ProveedorDeJuego } from './juego'

/**
 * Qué suena y, sobre todo, qué no. El reproductor de verdad se cambia por uno
 * que apunta lo que le piden: aquí no interesa cómo suena un acierto sino
 * cuándo se pide, y eso se puede mirar sin que suene nada.
 *
 * Se juega a `emparejar` porque terminar un tablero son toques y no arrastres,
 * y porque es la única mecánica donde fallar es un gesto tan corto como
 * acertar: tocar dos cartas que no van juntas.
 */

const PARTIDAS = NIVELES.emparejar[0].partidas

/** Más que cualquier espera del juego, para no tener que saber cuánto dura. */
const DE_SOBRA = 5000

/** El reproductor de mentira: no reproduce, toma nota. */
function espia() {
  const efectos: Efecto[] = []
  const musica: boolean[] = []
  const volumenes: number[] = []

  const reproductor: Reproductor = {
    efecto: (cual) => void efectos.push(cual),
    musica: (sonando) => void musica.push(sonando),
    volumen: (cuanto) => void volumenes.push(cuanto),
  }

  return { reproductor, efectos, musica, volumenes }
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

afterEach(() => vi.useRealTimers())

/** Arranca un tablero de `emparejar` con el progreso y el volumen que se le digan. */
function montar(oido: ReturnType<typeof espia>, { completadas = 0, volumen = 0.6 } = {}) {
  const empezado: Guardado = {
    ...porDefecto('es'),
    completadas: { ...porDefecto('es').completadas, emparejar: completadas },
    volumen,
  }
  localStorage.setItem(CLAVE, JSON.stringify(empezado))

  render(
    <ProveedorDeJuego preferencias={['es']}>
      <ProveedorDeAudio reproductor={oido.reproductor}>
        <MemoryRouter initialEntries={[rutas.partida('emparejar', 'espacio')]}>
          <App />
        </MemoryRouter>
      </ProveedorDeAudio>
    </ProveedorDeJuego>,
  )
}

const cartas = () => [...document.querySelectorAll<HTMLButtonElement>('[data-carta]')]

/** Las piezas que hay repartidas en el tablero, sin repetir. */
const piezas = () => [...new Set(cartas().map((carta) => carta.dataset.carta!.split('#')[0]))]

function tocar(carta: string) {
  const boton = document.querySelector<HTMLElement>(`[data-carta="${carta}"]`)
  if (boton) fireEvent.click(boton)
}

/** Empareja todas las cartas del tablero que hay a la vista. */
function resolverTablero() {
  for (const pieza of piezas()) {
    tocar(`${pieza}#1`)
    tocar(`${pieza}#2`)
  }
}

const esperar = () => act(() => void vi.advanceTimersByTime(DE_SOBRA))

test('cada pareja que sale bien suena', () => {
  const oido = espia()
  montar(oido)

  const cuantas = piezas().length
  resolverTablero()

  expect(oido.efectos.filter((cual) => cual === 'acierto')).toHaveLength(cuantas)
})

test('equivocarse no suena: probar no es meter la pata', () => {
  const oido = espia()
  montar(oido)

  const [una, otra] = piezas()
  tocar(`${una}#1`)
  tocar(`${otra}#1`)
  esperar()

  expect(oido.efectos).toEqual([])
})

test('terminar un tablero suena distinto que emparejar', () => {
  const oido = espia()
  montar(oido)

  resolverTablero()

  expect(oido.efectos.at(-1)).toBe('partida')
})

test('la celebración de partida suena una vez, no una por tablero pendiente', () => {
  const oido = espia()
  montar(oido)

  resolverTablero()
  esperar()

  expect(oido.efectos.filter((cual) => cual === 'partida')).toHaveLength(1)
})

test('cerrar el nivel tiene su propio sonido', () => {
  const oido = espia()
  montar(oido, { completadas: PARTIDAS - 1 })

  resolverTablero()
  esperar()

  expect(oido.efectos).toContain('nivel')
})

test('un tablero cualquiera no suena a nivel terminado', () => {
  const oido = espia()
  montar(oido)

  resolverTablero()
  esperar()

  expect(oido.efectos).not.toContain('nivel')
})

test('la música espera al primer toque: sola no arranca', () => {
  const oido = espia()
  montar(oido)

  expect(oido.musica).not.toContain(true)

  act(() => void fireEvent.pointerDown(document.body))

  expect(oido.musica.at(-1)).toBe(true)
})

test('con el volumen a cero no hay música', () => {
  const oido = espia()
  montar(oido, { volumen: 0 })

  act(() => void fireEvent.pointerDown(document.body))

  expect(oido.volumenes.at(-1)).toBe(0)
  expect(oido.musica).not.toContain(true)
})

test('con el volumen a cero el juego se juega igual', () => {
  const oido = espia()
  montar(oido, { volumen: 0, completadas: PARTIDAS - 1 })

  resolverTablero()
  esperar()

  // El nivel se ha cerrado con el sonido quitado: misma celebración, mismo
  // progreso guardado, mismo botón para seguir.
  const guardado = JSON.parse(localStorage.getItem(CLAVE)!) as Guardado
  expect(guardado.completadas.emparejar).toBe(PARTIDAS)
  expect(document.querySelector('[data-celebracion]')?.getAttribute('data-celebracion')).toBe('nivel')
  expect(screen.getByRole('button', { name: /seguir/i })).toBeTruthy()
})
