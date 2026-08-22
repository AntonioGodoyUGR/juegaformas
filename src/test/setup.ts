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

beforeEach(() => {
  // El progreso del niño vive en localStorage; cada test arranca en limpio.
  localStorage.clear()
})

afterEach(cleanup)
