import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// jsdom no implementa matchMedia y Tailwind/las media queries lo usan al montar.
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia

window.scrollTo = () => {}

// `@dnd-kit` observa el tamaño de huecos y fichas para saber dónde están, y
// jsdom no trae `ResizeObserver`. Aquí no hay que observar nada: jsdom tampoco
// maqueta, así que los tests que necesitan medidas se las ponen a mano.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  // El progreso del niño vive en localStorage; cada test arranca en limpio.
  localStorage.clear()
})

afterEach(cleanup)
