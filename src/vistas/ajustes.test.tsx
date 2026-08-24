import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from '../App'
import { PULSACION_LARGA } from '../componentes/pulsacionLarga'
import { ProveedorDeJuego } from '../estado/juego'
import { CLAVE, type Guardado, porDefecto } from '../lib/progreso'
import { textosDe } from '../textos'

/**
 * Los ajustes, vistos desde fuera: cómo se entra —que es lo que de verdad se
 * está probando— y qué pasa al tocar cada una de las tres cosas que hay dentro.
 *
 * La barrera es lo importante. Un niño de cinco años toca la pantalla entera,
 * incluida la esquina, así que lo que hay que demostrar no es que los ajustes
 * se abran sino que no se abren solos.
 */

const es = textosDe('es')
const en = textosDe('en')

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

afterEach(() => vi.useRealTimers())

/** Arranca el juego en el inicio, con el progreso que se le diga. */
function montar(guardado?: Partial<Guardado>) {
  if (guardado) localStorage.setItem(CLAVE, JSON.stringify({ ...porDefecto('es'), ...guardado }))

  render(
    <ProveedorDeJuego preferencias={['es']}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </ProveedorDeJuego>,
  )
}

/** El botón de la esquina se llama en el idioma del juego, como todo lo demás. */
const esquina = (textos = es) => screen.getByRole('button', { name: textos.ajustes.abrir })

const abiertos = () => screen.queryByRole('heading', { name: es.ajustes.titulo }) !== null

const correr = (milisegundos: number) => act(() => void vi.advanceTimersByTime(milisegundos))

/** Mantener el dedo encima el rato que hace falta y levantarlo. */
function mantener(textos = es) {
  const boton = esquina(textos)
  fireEvent.pointerDown(boton)
  correr(PULSACION_LARGA)
  fireEvent.pointerUp(boton)
}

const guardado = () => JSON.parse(localStorage.getItem(CLAVE)!) as Guardado

test('un toque en la esquina no abre nada', () => {
  montar()

  const boton = esquina()
  fireEvent.pointerDown(boton)
  fireEvent.pointerUp(boton)
  fireEvent.click(boton)
  correr(PULSACION_LARGA * 2)

  expect(abiertos()).toBe(false)
})

test('levantar el dedo antes de tiempo tampoco', () => {
  montar()

  const boton = esquina()
  fireEvent.pointerDown(boton)
  correr(PULSACION_LARGA - 100)
  fireEvent.pointerUp(boton)
  correr(PULSACION_LARGA)

  expect(abiertos()).toBe(false)
})

test('arrastrar el dedo fuera de la esquina cancela', () => {
  montar()

  const boton = esquina()
  fireEvent.pointerDown(boton)
  correr(PULSACION_LARGA / 2)
  fireEvent.pointerLeave(boton)
  correr(PULSACION_LARGA)

  expect(abiertos()).toBe(false)
})

test('manteniendo pulsado se abren los ajustes', () => {
  montar()

  mantener()

  expect(abiertos()).toBe(true)
})

test('también se abren aguantando la tecla, sin pantalla táctil', () => {
  montar()

  const boton = esquina()
  fireEvent.keyDown(boton, { key: 'Enter' })
  // La tecla repite mientras se aguanta y la cuenta no puede reiniciarse.
  fireEvent.keyDown(boton, { key: 'Enter', repeat: true })
  correr(PULSACION_LARGA)
  fireEvent.keyUp(boton, { key: 'Enter' })

  expect(abiertos()).toBe(true)
})

test('el idioma se cambia y el juego entero cambia con él', () => {
  montar()
  mantener()

  fireEvent.click(screen.getByRole('button', { name: 'English' }))

  expect(screen.getByRole('heading', { name: en.ajustes.titulo })).toBeTruthy()
  expect(guardado().idioma).toBe('en')
})

test('el volumen se puede dejar en silencio, y se recuerda', () => {
  montar()
  mantener()

  fireEvent.change(screen.getByRole('slider', { name: es.ajustes.volumen }), {
    target: { value: '0' },
  })

  expect(guardado().volumen).toBe(0)
  expect(screen.getByText(es.ajustes.silencio)).toBeTruthy()
})

test('borrar el progreso pregunta antes', () => {
  montar({ completadas: { encajar: 7, emparejar: 0, ordenar: 0 } })
  mantener()

  fireEvent.click(screen.getByRole('button', { name: es.ajustes.reiniciar.boton }))

  expect(screen.getByText(es.ajustes.reiniciar.pregunta)).toBeTruthy()
  expect(guardado().completadas.encajar).toBe(7)
})

test('decir que no deja el progreso donde estaba', () => {
  montar({ completadas: { encajar: 7, emparejar: 0, ordenar: 0 } })
  mantener()

  fireEvent.click(screen.getByRole('button', { name: es.ajustes.reiniciar.boton }))
  fireEvent.click(screen.getByRole('button', { name: es.ajustes.reiniciar.cancelar }))

  expect(screen.queryByText(es.ajustes.reiniciar.pregunta)).toBeNull()
  expect(guardado().completadas.encajar).toBe(7)
})

test('decir que sí deja el juego como recién instalado', () => {
  montar({ completadas: { encajar: 7, emparejar: 3, ordenar: 2 }, idioma: 'en', volumen: 0 })
  mantener(en)

  fireEvent.click(screen.getByRole('button', { name: en.ajustes.reiniciar.boton }))
  fireEvent.click(screen.getByRole('button', { name: en.ajustes.reiniciar.confirmar }))

  // Todo: lo jugado, el volumen y el idioma, que vuelve al del aparato.
  expect(guardado()).toEqual(porDefecto('es'))
  // Y de vuelta a la primera pantalla, que es donde empieza un juego nuevo.
  expect(screen.getByRole('heading', { name: es.nombre })).toBeTruthy()
})
