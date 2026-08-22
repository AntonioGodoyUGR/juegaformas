import { describe, expect, test } from 'vitest'
import { NIVELES, completaNivel, situacion } from './niveles'

const PARTIDAS = NIVELES.encajar[0].partidas

describe('situación', () => {
  test('quien empieza está en el primer nivel sin nada hecho', () => {
    expect(situacion('encajar', 0)).toMatchObject({ indice: 0, hechas: 0 })
  })

  test('las partidas completadas cuentan dentro del nivel', () => {
    expect(situacion('encajar', 4).hechas).toBe(4)
  })

  test('un progreso absurdo no rompe nada', () => {
    for (const valor of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(situacion('encajar', valor)).toMatchObject({ indice: 0, hechas: 0 })
    }
  })

  test('un decimal se trunca', () => {
    expect(situacion('encajar', 3.9).hechas).toBe(3)
  })

  test('agotado el último nivel se sigue jugando ese mismo', () => {
    const actual = situacion('encajar', PARTIDAS * 3)
    expect(actual.indice).toBe(NIVELES.encajar.length - 1)
    expect(actual.ultimo).toBe(true)
  })
})

describe('final de nivel', () => {
  test('la última partida del nivel lo completa', () => {
    expect(completaNivel('encajar', PARTIDAS - 1)).toBe(true)
  })

  test('la penúltima no', () => {
    expect(completaNivel('encajar', PARTIDAS - 2)).toBe(false)
  })

  test('exactamente una partida de cada nivel lo completa', () => {
    const completan = Array.from({ length: PARTIDAS }, (_, hechas) =>
      completaNivel('encajar', hechas),
    ).filter(Boolean)
    expect(completan).toHaveLength(1)
  })
})
