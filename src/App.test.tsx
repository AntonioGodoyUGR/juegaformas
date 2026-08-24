import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import App from './App'
import { ProveedorDeJuego } from './estado/juego'
import { rutas } from './rutas'

// Pruebas de humo del enrutado. Los tests de verdad irán sobre la lógica pura
// de `src/lib/`.

function montar(ruta: string) {
  return render(
    <ProveedorDeJuego preferencias={['es']}>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </ProveedorDeJuego>,
  )
}

test('la raíz muestra el inicio', () => {
  montar(rutas.inicio)
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})

test('una mecánica lleva a la elección de tema', () => {
  montar(rutas.temas('encajar'))
  expect(screen.getByRole('heading', { name: 'Encajar' })).toBeInTheDocument()
})

test('mecánica y tema llevan a la partida', () => {
  montar(rutas.partida('encajar', 'espacio'))
  expect(screen.getByRole('heading', { name: /Encajar/ })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /Espacio/ })).toBeInTheDocument()
})

test('una ruta que no existe devuelve al inicio', () => {
  montar('/esto/no/existe/en/absoluto')
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})

// Estas dos URLs se escriben a mano a propósito: `rutas` ya no deja construir
// una mecánica ni un tema que no existan, y lo que se prueba es justo lo que
// llega de fuera, tecleado en la barra de direcciones.
test('una mecánica inventada devuelve al inicio', () => {
  montar('/bailar')
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})

test('un tema inventado devuelve al inicio', () => {
  montar('/encajar/dinosaurios')
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})
