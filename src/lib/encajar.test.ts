import { describe, expect, test } from 'vitest'
import { crearTablero, estaTerminado, soltar } from './encajar'
import { generarPartida } from './partida'

const partida = () => generarPartida('encajar', 'espacio', 0, () => 0)

describe('tablero', () => {
  test('reparte la misma partida en huecos y fichas', () => {
    const tablero = crearTablero(partida())

    expect(tablero.huecos).toHaveLength(3)
    expect([...tablero.fichas].map((p) => p.id).sort()).toEqual(
      [...tablero.huecos].map((p) => p.id).sort(),
    )
    expect(tablero.encajadas.size).toBe(0)
  })

  test('las fichas no salen en el mismo orden que los huecos', () => {
    // Con el mismo orden arriba y abajo, el tablero se resuelve subiendo el
    // dedo en línea recta y deja de ser un puzzle. `() => 0` hace que barajar
    // devuelva un orden fijo, así que esto prueba el rescate por rotación.
    const tablero = crearTablero(partida(), () => 0)

    expect(tablero.fichas.map((p) => p.id)).not.toEqual(tablero.huecos.map((p) => p.id))
  })

  test('un tablero recién repartido no está terminado', () => {
    expect(estaTerminado(crearTablero(partida()))).toBe(false)
  })
})

describe('soltar una pieza', () => {
  test('la pieza entra en su hueco', () => {
    const tablero = crearTablero(partida())
    const pieza = tablero.huecos[0].id

    const { tablero: despues, acierto } = soltar(tablero, pieza, pieza)

    expect(acierto).toBe(true)
    expect(despues.encajadas.has(pieza)).toBe(true)
  })

  test('en el hueco equivocado no entra y no pasa nada más', () => {
    const tablero = crearTablero(partida())

    const { tablero: despues, acierto } = soltar(tablero, tablero.huecos[0].id, tablero.huecos[1].id)

    // Fallar no resta, no bloquea y no mueve el tablero: es el mismo objeto.
    expect(acierto).toBe(false)
    expect(despues).toBe(tablero)
  })

  test('soltarla lejos de todo es fallar, no romperse', () => {
    const tablero = crearTablero(partida())

    const { tablero: despues, acierto } = soltar(tablero, tablero.huecos[0].id, null)

    expect(acierto).toBe(false)
    expect(despues).toBe(tablero)
  })

  test('fallar cuantas veces haga falta deja el tablero igual de jugable', () => {
    let tablero = crearTablero(partida())
    const pieza = tablero.huecos[0].id

    for (let intento = 0; intento < 20; intento++) {
      tablero = soltar(tablero, pieza, null).tablero
    }

    expect(soltar(tablero, pieza, pieza).acierto).toBe(true)
  })

  test('no muta el tablero anterior', () => {
    const antes = crearTablero(partida())
    const pieza = antes.huecos[0].id

    soltar(antes, pieza, pieza)

    expect(antes.encajadas.size).toBe(0)
  })

  test('volver a soltar una pieza ya encajada no cuenta dos veces', () => {
    const tablero = crearTablero(partida())
    const pieza = tablero.huecos[0].id
    const despues = soltar(tablero, pieza, pieza).tablero

    const repetido = soltar(despues, pieza, pieza)

    expect(repetido.acierto).toBe(false)
    expect(repetido.tablero.encajadas.size).toBe(1)
  })

  test('el tablero se acaba cuando están todas y ni una antes', () => {
    let tablero = crearTablero(partida())

    for (const pieza of tablero.huecos) {
      expect(estaTerminado(tablero)).toBe(false)
      tablero = soltar(tablero, pieza.id, pieza.id).tablero
    }

    expect(estaTerminado(tablero)).toBe(true)
  })
})
