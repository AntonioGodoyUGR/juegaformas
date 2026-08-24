import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import App from '../App'
import { anotarPartida, guardar, leer, porDefecto } from '../lib/progreso'
import { Pieza } from '../piezas'
import { rutas } from '../rutas'
import { ProveedorDeJuego, useJuego } from './juego'

/** Un botón de idioma de mentira: el de verdad es del ticket 12. */
function Interruptor() {
  const { guardado, cambiarIdioma } = useJuego()
  const otro = guardado.idioma === 'es' ? 'en' : 'es'
  return <button onClick={() => cambiarIdioma(otro)}>cambiar</button>
}

function montar(ruta: string, preferencias: readonly string[] = ['es']) {
  return render(
    <ProveedorDeJuego preferencias={preferencias}>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
        <Interruptor />
      </MemoryRouter>
    </ProveedorDeJuego>,
  )
}

test('arranca en el idioma del dispositivo si es uno de los dos', () => {
  montar(rutas.temas('encajar'), ['en-GB', 'fr'])
  expect(screen.getByRole('heading', { name: 'Fit' })).toBeInTheDocument()
})

test('un dispositivo en un idioma que no hablamos arranca en castellano', () => {
  montar(rutas.temas('encajar'), ['fr-FR', 'de'])
  expect(screen.getByRole('heading', { name: 'Encajar' })).toBeInTheDocument()
})

test('lo guardado manda sobre el idioma del dispositivo', () => {
  guardar({ ...porDefecto(), idioma: 'en' })
  montar(rutas.temas('encajar'), ['es-ES'])
  expect(screen.getByRole('heading', { name: 'Fit' })).toBeInTheDocument()
})

test('cambiar de idioma no recarga la aplicación ni pierde el progreso', () => {
  guardar(anotarPartida(porDefecto(), 'ordenar'))
  montar(rutas.partida('encajar', 'espacio'))
  expect(screen.getByRole('heading', { name: 'Encajar · Espacio' })).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'cambiar' }))

  expect(screen.getByRole('heading', { name: 'Fit · Space' })).toBeInTheDocument()
  expect(leer().completadas.ordenar).toBe(1)
  expect(leer().idioma).toBe('en')
})

test('el idioma elegido sigue puesto en el siguiente arranque', () => {
  montar(rutas.inicio)
  fireEvent.click(screen.getByRole('button', { name: 'cambiar' }))
  expect(leer().idioma).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})

test('la pieza se nombra en el idioma activo', () => {
  render(
    <ProveedorDeJuego preferencias={['es']}>
      <Pieza id="mar/pulpo" />
      <Interruptor />
    </ProveedorDeJuego>,
  )
  expect(screen.getByRole('img', { name: 'Pulpo' })).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'cambiar' }))
  expect(screen.getByRole('img', { name: 'Octopus' })).toBeInTheDocument()
})

test('una pieza decorativa no se nombra dos veces', () => {
  render(
    <ProveedorDeJuego preferencias={['es']}>
      <Pieza id="mar/pulpo" />
      <Pieza id="mar/pulpo" decorativa />
    </ProveedorDeJuego>,
  )
  expect(screen.getAllByRole('img', { name: 'Pulpo' })).toHaveLength(1)
})
