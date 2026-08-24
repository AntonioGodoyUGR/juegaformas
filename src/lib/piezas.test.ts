import { describe, expect, test } from 'vitest'
import { TEMAS } from './dominio'
import { PIEZAS_MAXIMAS } from './niveles'
import { muestraDe, piezasDe, todasLasPiezas } from './piezas'

describe('catálogo', () => {
  test('ningún tema se queda corto para el tablero más grande', () => {
    for (const tema of TEMAS) {
      expect(piezasDe(tema).length).toBeGreaterThanOrEqual(PIEZAS_MAXIMAS)
    }
  })

  test('no hay identificadores repetidos entre temas', () => {
    const ids = todasLasPiezas().map((pieza) => pieza.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('cada pieza pertenece al tema desde el que se pide', () => {
    for (const tema of TEMAS) {
      for (const pieza of piezasDe(tema)) {
        expect(pieza.tema).toBe(tema)
        expect(pieza.id.startsWith(`${tema}/`)).toBe(true)
      }
    }
  })
})

describe('muestra de tema', () => {
  test('cada tema tiene una pieza con la que anunciarse', () => {
    for (const tema of TEMAS) {
      expect(muestraDe(tema).tema).toBe(tema)
    }
  })

  test('la muestra no cambia entre visitas', () => {
    // Un niño que no lee elige el tema por el dibujo. Si el dibujo cambia, el
    // tema deja de ser reconocible.
    for (const tema of TEMAS) {
      expect(muestraDe(tema).id).toBe(muestraDe(tema).id)
      expect(muestraDe(tema)).toBe(piezasDe(tema)[0])
    }
  })
})
