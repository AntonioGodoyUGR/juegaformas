import { describe, expect, test } from 'vitest'
import { TEMAS } from './dominio'
import { NIVELES } from './niveles'
import { piezasDe, todasLasPiezas } from './piezas'

const PIEZAS_DEL_TABLERO_MAS_GRANDE = Math.max(
  ...Object.values(NIVELES).flatMap((niveles) => niveles.map((nivel) => nivel.piezas)),
)

describe('catálogo', () => {
  test('ningún tema se queda corto para el tablero más grande', () => {
    for (const tema of TEMAS) {
      expect(piezasDe(tema).length).toBeGreaterThanOrEqual(PIEZAS_DEL_TABLERO_MAS_GRANDE)
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
