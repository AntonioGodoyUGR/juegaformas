import { expect, test } from 'vitest'
import { todasLasPiezas } from '../lib/piezas'
import { DIBUJOS } from './index'

const CATALOGO = new Set(todasLasPiezas().map((pieza) => pieza.id))

test('todo dibujo corresponde a una pieza del catálogo', () => {
  for (const id of Object.keys(DIBUJOS)) {
    expect(CATALOGO.has(id), `${id} no existe en el catálogo`).toBe(true)
  }
})

test('todas las piezas del catálogo están dibujadas', () => {
  // Una pieza sin dibujo deja un hueco en el tablero, así que el juego no puede
  // llegar a producción con el catálogo a medias.
  for (const id of CATALOGO) {
    expect(DIBUJOS[id], `falta el dibujo de ${id}`).toBeDefined()
  }
})
