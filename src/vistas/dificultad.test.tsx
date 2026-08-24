import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import App from '../App'
import { ProveedorDeJuego } from '../estado/juego'
import { MECANICAS } from '../lib/dominio'
import { piezasDeNivel } from '../lib/niveles'
import { rutas } from '../rutas'
import { es } from '../textos/es'

/**
 * La dificultad vista como la usa el adulto que está sentado al lado: tocar
 * uno de los tres botones y que el tablero siguiente venga del tamaño elegido.
 *
 * Se prueba de punta a punta —pantalla de temas, tablero, y vuelta— porque lo
 * que hay que garantizar no es que un componente pinte tres botones, sino que
 * lo que se toca aquí llegue hasta las piezas que se reparten allí.
 */

beforeEach(() => localStorage.clear())

function montar(ruta: string = rutas.inicio) {
  return render(
    <ProveedorDeJuego preferencias={['es']}>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </ProveedorDeJuego>,
  )
}

const tocarEnlace = (nombre: string) => fireEvent.click(screen.getByRole('link', { name: nombre }))

const tocarDificultad = (nombre: string) =>
  fireEvent.click(screen.getByRole('button', { name: nombre }))

/** Cuántas fichas hay repartidas en el tablero de `encajar` que se está viendo. */
const fichasEnPantalla = () => document.querySelectorAll('[data-ficha]').length

test.each(MECANICAS)('%s tiene sus tres dificultades y ninguna más', (mecanica) => {
  montar(rutas.temas(mecanica))

  const fila = screen.getByRole('group', { name: es.dificultad.titulo })
  expect(fila.querySelectorAll('button')).toHaveLength(3)
})

test('de fábrica está elegida la más fácil', () => {
  montar(rutas.temas('encajar'))

  expect(screen.getByRole('button', { name: es.dificultad.nombres.facil })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(screen.getByRole('button', { name: es.dificultad.nombres.dificil })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

test('lo que se elige aquí es lo que trae el tablero de allí', () => {
  montar(rutas.temas('encajar'))

  tocarDificultad(es.dificultad.nombres.dificil)
  tocarEnlace('Espacio')

  expect(fichasEnPantalla()).toBe(piezasDeNivel('encajar', 'dificil'))
})

test('la más fácil reparte menos piezas que la más difícil', () => {
  montar(rutas.temas('encajar'))
  tocarEnlace('Espacio')

  expect(fichasEnPantalla()).toBe(piezasDeNivel('encajar', 'facil'))
  expect(piezasDeNivel('encajar', 'facil')).toBeLessThan(piezasDeNivel('encajar', 'dificil'))
})

test('cambiarla es cambiar la de esa mecánica, no la del juego', () => {
  montar(rutas.temas('encajar'))
  tocarDificultad(es.dificultad.nombres.dificil)

  tocarEnlace('Volver')
  tocarEnlace(es.mecanicas.emparejar)

  // Emparejar sigue donde estaba: un niño que encaja seis de sobra puede estar
  // atascado emparejando tres.
  expect(screen.getByRole('button', { name: es.dificultad.nombres.facil })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('sigue puesta la próxima vez que se abre el juego', () => {
  const { unmount } = montar(rutas.temas('ordenar'))
  tocarDificultad(es.dificultad.nombres.media)
  unmount()

  montar(rutas.temas('ordenar'))

  expect(screen.getByRole('button', { name: es.dificultad.nombres.media })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('no se mete en el camino del niño: sigue jugando en dos toques', () => {
  montar()

  tocarEnlace('Encajar')
  tocarEnlace('Espacio')

  expect(screen.getByRole('heading', { name: 'Encajar · Espacio' })).toBeInTheDocument()
})
