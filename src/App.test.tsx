import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

// Prueba de humo: valida que el arnés de tests funciona de punta a punta.
// Los tests de verdad irán sobre la lógica pura de `src/lib/`.
test('la aplicación monta', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})
