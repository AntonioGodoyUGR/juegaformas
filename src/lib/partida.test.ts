import { describe, expect, test } from 'vitest'
import { TEMAS } from './dominio'
import { NIVELES } from './niveles'
import { barajar, generarPartida } from './partida'

/** Azar previsible: siempre devuelve el primer elemento del rango. */
const sinAzar = () => 0

describe('barajar', () => {
  test('no toca el original y conserva todos los elementos', () => {
    const original = [1, 2, 3, 4, 5]
    const revuelto = barajar(original, () => 0.5)
    expect(original).toEqual([1, 2, 3, 4, 5])
    expect([...revuelto].sort()).toEqual(original)
  })
})

describe('generar partida', () => {
  test('trae las piezas que pide el nivel, sin repetir', () => {
    const partida = generarPartida('encajar', 'espacio', 0)
    expect(partida.piezas).toHaveLength(NIVELES.encajar[0].piezas)
    expect(new Set(partida.piezas.map((pieza) => pieza.id)).size).toBe(partida.piezas.length)
  })

  test('todas las piezas salen del tema elegido', () => {
    for (const tema of TEMAS) {
      const partida = generarPartida('emparejar', tema, 0)
      expect(partida.piezas.every((pieza) => pieza.tema === tema)).toBe(true)
    }
  })

  test('con el mismo azar sale el mismo tablero', () => {
    const uno = generarPartida('ordenar', 'mar', 0, sinAzar)
    const otro = generarPartida('ordenar', 'mar', 0, sinAzar)
    expect(uno.piezas.map((pieza) => pieza.id)).toEqual(otro.piezas.map((pieza) => pieza.id))
  })

  test('un progreso corrupto sigue dando un tablero jugable', () => {
    const partida = generarPartida('encajar', 'comida', Number.NaN)
    expect(partida.piezas.length).toBeGreaterThan(0)
  })
})
