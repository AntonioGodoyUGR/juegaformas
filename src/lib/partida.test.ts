import { describe, expect, test } from 'vitest'
import { DIFICULTADES, MECANICAS, TEMAS } from './dominio'
import { PIEZAS_MAXIMAS, piezasDeNivel } from './niveles'
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
  test('trae las piezas que pide la dificultad, sin repetir', () => {
    for (const mecanica of MECANICAS) {
      for (const dificultad of DIFICULTADES) {
        const partida = generarPartida(mecanica, 'espacio', dificultad)
        expect(partida.piezas).toHaveLength(piezasDeNivel(mecanica, dificultad))
        expect(new Set(partida.piezas.map((pieza) => pieza.id)).size).toBe(partida.piezas.length)
      }
    }
  })

  test('subir la dificultad nunca quita piezas', () => {
    for (const mecanica of MECANICAS) {
      const cuantas = DIFICULTADES.map(
        (dificultad) => generarPartida(mecanica, 'mar', dificultad).piezas.length,
      )
      expect(cuantas).toEqual([...cuantas].sort((uno, otro) => uno - otro))
      expect(new Set(cuantas).size).toBe(DIFICULTADES.length)
    }
  })

  test('todas las piezas salen del tema elegido', () => {
    for (const tema of TEMAS) {
      const partida = generarPartida('emparejar', tema, 'dificil')
      expect(partida.piezas.every((pieza) => pieza.tema === tema)).toBe(true)
    }
  })

  test('con el mismo azar sale el mismo tablero', () => {
    const uno = generarPartida('ordenar', 'mar', 'media', sinAzar)
    const otro = generarPartida('ordenar', 'mar', 'media', sinAzar)
    expect(uno.piezas.map((pieza) => pieza.id)).toEqual(otro.piezas.map((pieza) => pieza.id))
  })

  test('ningún tablero pide más piezas de las que tiene un tema', () => {
    for (const mecanica of MECANICAS) {
      for (const dificultad of DIFICULTADES) {
        expect(piezasDeNivel(mecanica, dificultad)).toBeLessThanOrEqual(PIEZAS_MAXIMAS)
      }
    }
  })
})
