import { describe, expect, test } from 'vitest'
import { FALLOS_PARA_PISTA, type Pista, SIN_PISTA, acertar, estaSenalado, fallar, hayPista } from './pista'

/** Falla unas cuantas veces seguidas contra el mismo destino. */
function fallarVeces(veces: number, destino: string | null = null): Pista {
  let pista = SIN_PISTA
  for (let i = 0; i < veces; i++) pista = fallar(pista, destino)
  return pista
}

describe('cuándo aparece la pista', () => {
  test('recién empezado no hay pista', () => {
    expect(hayPista(SIN_PISTA)).toBe(false)
  })

  test('fallar una vez no la trae: fallar es normal', () => {
    expect(hayPista(fallar(SIN_PISTA, 'un hueco'))).toBe(false)
  })

  test('aparece al llegar a los fallos seguidos que hacen falta', () => {
    expect(hayPista(fallarVeces(FALLOS_PARA_PISTA - 1))).toBe(false)
    expect(hayPista(fallarVeces(FALLOS_PARA_PISTA))).toBe(true)
  })

  test('hacen falta varios fallos: uno solo nunca basta', () => {
    // Con la pista al primer fallo el juego dejaría de ser un juego y pasaría a
    // ser seguir luces.
    expect(FALLOS_PARA_PISTA).toBeGreaterThan(1)
  })

  test('una vez puesta, seguir fallando no la quita', () => {
    expect(hayPista(fallarVeces(FALLOS_PARA_PISTA + 4))).toBe(true)
  })
})

describe('a qué señala', () => {
  test('al destino del último intento, y no a otro', () => {
    const pista = fallarVeces(FALLOS_PARA_PISTA, 'el hueco del cohete')

    expect(estaSenalado(pista, 'el hueco del cohete')).toBe(true)
    expect(estaSenalado(pista, 'el hueco de la luna')).toBe(false)
  })

  test('sigue al niño si cambia de pieza', () => {
    // La pista no se queda clavada en la primera pieza que probó: señala lo
    // último que ha intentado, que es donde está mirando.
    let pista = fallarVeces(FALLOS_PARA_PISTA, 'el hueco del cohete')
    pista = fallar(pista, 'el hueco de la luna')

    expect(estaSenalado(pista, 'el hueco de la luna')).toBe(true)
    expect(estaSenalado(pista, 'el hueco del cohete')).toBe(false)
  })

  test('antes de tiempo no señala nada, aunque haya destino', () => {
    expect(estaSenalado(fallar(SIN_PISTA, 'el hueco del cohete'), 'el hueco del cohete')).toBe(
      false,
    )
  })

  test('se puede contar un fallo sin destino: `emparejar` no lo sabe al fallar', () => {
    const pista = fallarVeces(FALLOS_PARA_PISTA)

    expect(hayPista(pista)).toBe(true)
    expect(pista.destino).toBeNull()
  })
})

describe('acertar', () => {
  test('reinicia la cuenta', () => {
    expect(acertar(fallarVeces(FALLOS_PARA_PISTA))).toEqual(SIN_PISTA)
  })

  test('deja de señalar: la pista era para ese atasco, y se acabó', () => {
    const pista = acertar(fallarVeces(FALLOS_PARA_PISTA, 'el hueco del cohete'))

    expect(hayPista(pista)).toBe(false)
    expect(estaSenalado(pista, 'el hueco del cohete')).toBe(false)
  })

  test('acertar sin fallos no cambia nada, ni siquiera el objeto', () => {
    // Devolver el mismo objeto es lo que evita que la vista repinte en cada
    // acierto de una partida jugada sin un solo fallo.
    expect(acertar(SIN_PISTA)).toBe(SIN_PISTA)
  })

  test('después de acertar hay que volver a atascarse desde cero', () => {
    let pista = acertar(fallarVeces(FALLOS_PARA_PISTA))
    pista = fallar(pista, 'un hueco')

    expect(hayPista(pista)).toBe(false)
  })
})
