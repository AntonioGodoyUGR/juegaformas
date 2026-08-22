import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import App from './App'
import { rutas } from './rutas'

// Pruebas de humo del enrutado. Los tests de verdad irán sobre la lógica pura
// de `src/lib/`.

function montar(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  )
}

test('la raíz muestra el inicio', () => {
  montar(rutas.inicio)
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})

test('una mecánica lleva a la elección de tema', () => {
  montar(rutas.temas('encajar'))
  expect(screen.getByRole('heading', { name: 'encajar' })).toBeInTheDocument()
})

test('mecánica y tema llevan a la partida', () => {
  montar(rutas.partida('encajar', 'espacio'))
  expect(screen.getByRole('heading', { name: /encajar/ })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /espacio/ })).toBeInTheDocument()
})

test('una ruta que no existe devuelve al inicio', () => {
  montar('/esto/no/existe/en/absoluto')
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})
