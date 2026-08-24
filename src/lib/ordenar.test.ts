import { describe, expect, test } from 'vitest'
import { NIVELES } from './niveles'
import { generarPartida } from './partida'
import {
  CRITERIOS,
  type Criterio,
  INICIO,
  crearTablero,
  criterioDe,
  estaColocado,
  estaTerminado,
  secuencia,
  soltar,
} from './ordenar'

const partida = () => generarPartida('ordenar', 'espacio', 'facil', () => 0)
const tableroDe = (criterio: Criterio = 'tamano') => crearTablero(partida(), criterio)

describe('la secuencia', () => {
  test('todos los eslabones son la misma pieza', () => {
    // El criterio es lo único que cambia de un eslabón al siguiente. Con dibujos
    // distintos habría dos cosas que comparar y la solución dejaría de ser
    // evidente.
    const tablero = tableroDe()

    expect(new Set(tablero.eslabones.map((eslabon) => eslabon.id.split('#')[0]))).toEqual(
      new Set([tablero.pieza]),
    )
  })

  test('hay un eslabón por cada pieza que reparte el nivel, con grados seguidos', () => {
    const tablero = crearTablero(partida(), 'tamano')
    const grados = tablero.eslabones.map((eslabon) => eslabon.grado).sort((a, b) => a - b)

    expect(grados).toEqual([1, 2, 3])
    expect(grados[0]).toBe(INICIO)
  })

  test('la secuencia va del inicio al fin', () => {
    const tablero = tableroDe()

    expect(secuencia(tablero)).toEqual([1, 2, 3])
    expect(tablero.colocados.size).toBe(0)
  })

  test('la bandeja no empieza ya ordenada', () => {
    // `() => 0` deja el barajado en el orden de partida; sin la rotación, el
    // niño se encontraría la secuencia hecha antes de tocar nada.
    const tablero = crearTablero(partida(), 'tamano', () => 0)

    expect(tablero.eslabones.map((eslabon) => eslabon.grado)).not.toEqual(secuencia(tablero))
  })

  test('el criterio se guarda tal cual se pide', () => {
    expect(tableroDe('cantidad').criterio).toBe('cantidad')
    expect(tableroDe('tamano').criterio).toBe('tamano')
  })
})

describe('colocar eslabones', () => {
  test('cada eslabón entra en su sitio', () => {
    const tablero = tableroDe()
    const resultado = soltar(tablero, 2, 2)

    expect(resultado.acierto).toBe(true)
    expect(estaColocado(resultado.tablero, 2)).toBe(true)
    expect(estaColocado(resultado.tablero, 1)).toBe(false)
  })

  test('se puede empezar por donde se quiera', () => {
    // No hay que ir del inicio al fin: el fin primero también vale.
    let tablero = tableroDe()

    for (const grado of [3, 1, 2]) {
      const resultado = soltar(tablero, grado, grado)
      expect(resultado.acierto).toBe(true)
      tablero = resultado.tablero
    }

    expect(estaTerminado(tablero)).toBe(true)
  })

  test('el sitio equivocado devuelve la pieza y no cambia nada', () => {
    const tablero = tableroDe()
    const resultado = soltar(tablero, 1, 3)

    expect(resultado.acierto).toBe(false)
    // El mismo objeto: fallar no repinta el tablero.
    expect(resultado.tablero).toBe(tablero)
    expect(estaColocado(resultado.tablero, 3)).toBe(false)
  })

  test('soltar lejos de todo es fallar, sin más', () => {
    const tablero = tableroDe()
    const resultado = soltar(tablero, 1, null)

    expect(resultado.acierto).toBe(false)
    expect(resultado.tablero).toBe(tablero)
  })

  test('fallar no gasta nada: el mismo eslabón entra después', () => {
    const tablero = tableroDe()
    const fallado = soltar(tablero, 1, 2).tablero

    expect(soltar(fallado, 1, 1).acierto).toBe(true)
  })

  test('un eslabón ya colocado no se vuelve a colocar', () => {
    const puesto = soltar(tableroDe(), 1, 1).tablero

    expect(soltar(puesto, 1, 1).acierto).toBe(false)
  })

  test('la partida se acaba cuando está la secuencia entera', () => {
    let tablero = tableroDe()

    for (const grado of secuencia(tablero)) {
      expect(estaTerminado(tablero)).toBe(false)
      tablero = soltar(tablero, grado, grado).tablero
    }

    expect(estaTerminado(tablero)).toBe(true)
  })
})

describe('con qué criterio toca jugar', () => {
  test('se turnan partida a partida', () => {
    expect(criterioDe(0)).toBe('tamano')
    expect(criterioDe(1)).toBe('cantidad')
    expect(criterioDe(2)).toBe('tamano')
  })

  test('los dos criterios salen dentro del primer nivel', () => {
    // Si alguien añade un tercer criterio y el nivel se queda corto, este test
    // avisa: un criterio que no llega a salir no existe.
    const partidas = NIVELES.ordenar[0].partidas
    const salen = new Set(Array.from({ length: partidas }, (_, i) => criterioDe(i)))

    expect(salen).toEqual(new Set(CRITERIOS))
  })

  test('un progreso raro no rompe el turno', () => {
    expect(criterioDe(-1)).toBe('tamano')
    expect(CRITERIOS).toContain(criterioDe(1.5))
  })
})
