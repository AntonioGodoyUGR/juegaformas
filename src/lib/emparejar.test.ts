import { describe, expect, test } from 'vitest'
import {
  type Tablero,
  BOCA_ABAJO_DESDE,
  crearTablero,
  esperando,
  estaEmparejada,
  estaTerminado,
  estaVisible,
  juegaBocaAbajo,
  parejaPendiente,
  recoger,
  tocar,
} from './emparejar'
import { NIVELES } from './niveles'
import { generarPartida } from './partida'

const partida = () => generarPartida('emparejar', 'espacio', 0, () => 0)
const tableroDe = (bocaAbajo = false) => crearTablero(partida(), bocaAbajo, () => 0)

/** Las dos cartas de una pieza del tablero, en el orden en que salieron. */
function parejaDe(tablero: Tablero, pieza: string) {
  return tablero.cartas.filter((carta) => carta.pieza === pieza).map((carta) => carta.id)
}

/** Dos cartas que no son pareja. */
function desparejadas(tablero: Tablero) {
  const [primera] = tablero.cartas
  const otra = tablero.cartas.find((carta) => carta.pieza !== primera.pieza)!
  return [primera.id, otra.id]
}

/** Hace todas las parejas, una detrás de otra. */
function resolver(tablero: Tablero): Tablero {
  for (const pieza of new Set(tablero.cartas.map((carta) => carta.pieza))) {
    const [una, otra] = parejaDe(tablero, pieza)
    tablero = tocar(tablero, una).tablero
    tablero = tocar(tablero, otra).tablero
  }
  return tablero
}

describe('tablero', () => {
  test('cada pieza pone dos cartas', () => {
    const tablero = tableroDe()

    expect(tablero.cartas).toHaveLength(6)
    for (const pieza of partida().piezas) {
      expect(parejaDe(tablero, pieza.id)).toHaveLength(2)
    }
  })

  test('las dos cartas de una pieza no son la misma carta', () => {
    // Sin identidad propia, tocar una carta levantaría las dos y no habría
    // pareja que hacer.
    const tablero = tableroDe()
    const identificadores = new Set(tablero.cartas.map((carta) => carta.id))

    expect(identificadores.size).toBe(tablero.cartas.length)
  })

  test('un tablero recién repartido no está terminado ni espera nada', () => {
    const tablero = tableroDe()

    expect(estaTerminado(tablero)).toBe(false)
    expect(esperando(tablero)).toBe(false)
    expect(tablero.emparejadas.size).toBe(0)
  })
})

describe('tocar cartas', () => {
  test('dos cartas de la misma pieza son pareja', () => {
    const tablero = tableroDe()
    const [una, otra] = parejaDe(tablero, tablero.cartas[0].pieza)

    const primero = tocar(tablero, una)
    expect(primero.toque).toBe(null)

    const segundo = tocar(primero.tablero, otra)

    expect(segundo.toque).toBe('acierto')
    expect(estaEmparejada(segundo.tablero, tablero.cartas[0].pieza)).toBe(true)
    // La pareja hecha ya no está levantada: está resuelta, que es otra cosa.
    expect(segundo.tablero.levantadas).toEqual([])
  })

  test('dos cartas de piezas distintas no lo son', () => {
    const tablero = tableroDe()
    const [una, otra] = desparejadas(tablero)

    const fallo = tocar(tocar(tablero, una).tablero, otra)

    expect(fallo.toque).toBe('fallo')
    expect(fallo.tablero.emparejadas.size).toBe(0)
    // Las dos se quedan a la vista: son los segundos en que el niño mira.
    expect(esperando(fallo.tablero)).toBe(true)
  })

  test('mientras hay una pareja fallada a la vista no se levanta una tercera', () => {
    // Un niño toca rápido. Sin esto, el tablero acabaría con media docena de
    // cartas levantadas y dejaría de tener sentido.
    const tablero = tableroDe()
    const [una, otra] = desparejadas(tablero)
    const fallado = tocar(tocar(tablero, una).tablero, otra).tablero
    const tercera = tablero.cartas.find((carta) => carta.id !== una && carta.id !== otra)!

    const despues = tocar(fallado, tercera.id)

    expect(despues.tablero).toBe(fallado)
    expect(despues.toque).toBe(null)
  })

  test('tocar dos veces la misma carta no la empareja consigo misma', () => {
    const tablero = tableroDe()
    const [una] = parejaDe(tablero, tablero.cartas[0].pieza)
    const levantada = tocar(tablero, una).tablero

    const repetido = tocar(levantada, una)

    expect(repetido.toque).toBe(null)
    expect(repetido.tablero).toBe(levantada)
  })

  test('una pareja ya hecha no se puede deshacer tocándola', () => {
    const tablero = tableroDe()
    const pieza = tablero.cartas[0].pieza
    const [una, otra] = parejaDe(tablero, pieza)
    const hecha = tocar(tocar(tablero, una).tablero, otra).tablero

    const despues = tocar(hecha, una)

    expect(despues.tablero).toBe(hecha)
    expect(estaEmparejada(despues.tablero, pieza)).toBe(true)
  })

  test('recoger devuelve las cartas falladas a su sitio y nada más', () => {
    const tablero = tableroDe()
    const [una, otra] = desparejadas(tablero)
    const fallado = tocar(tocar(tablero, una).tablero, otra).tablero

    const recogido = recoger(fallado)

    expect(recogido.levantadas).toEqual([])
    expect(recogido.emparejadas.size).toBe(0)
    expect(recogido.cartas).toEqual(tablero.cartas)
  })

  test('recoger un tablero que no espera nada lo deja igual', () => {
    const tablero = tableroDe()

    expect(recoger(tablero)).toBe(tablero)
  })

  test('fallar cuantas veces haga falta deja el tablero igual de jugable', () => {
    let tablero = tableroDe()
    const [una, otra] = desparejadas(tablero)

    for (let intento = 0; intento < 20; intento++) {
      tablero = recoger(tocar(tocar(tablero, una).tablero, otra).tablero)
    }

    expect(estaTerminado(resolver(tablero))).toBe(true)
  })

  test('el tablero se acaba cuando están todas las parejas y ni una antes', () => {
    let tablero = tableroDe()

    for (const pieza of partida().piezas) {
      expect(estaTerminado(tablero)).toBe(false)
      const [una, otra] = parejaDe(tablero, pieza.id)
      tablero = tocar(tablero, una).tablero
      tablero = tocar(tablero, otra).tablero
    }

    expect(estaTerminado(tablero)).toBe(true)
  })

  test('no muta el tablero anterior', () => {
    const antes = tableroDe()
    const [una, otra] = parejaDe(antes, antes.cartas[0].pieza)

    tocar(tocar(antes, una).tablero, otra)

    expect(antes.levantadas).toEqual([])
    expect(antes.emparejadas.size).toBe(0)
  })
})

describe('los dos modos comparten tablero', () => {
  // Esto es el "hecho cuando" del ticket. Lo único que puede diferenciarlos es
  // qué se ve; si algún día se separan las reglas, este test lo cuenta.
  test('la misma secuencia de toques acaba igual destapado que boca abajo', () => {
    const destapado = resolver(tableroDe(false))
    const tapado = resolver(tableroDe(true))

    expect(estaTerminado(destapado)).toBe(true)
    expect(estaTerminado(tapado)).toBe(true)
    expect([...tapado.emparejadas]).toEqual([...destapado.emparejadas])
  })

  test('destapado se ve todo desde el principio', () => {
    const tablero = tableroDe(false)

    for (const carta of tablero.cartas) expect(estaVisible(tablero, carta)).toBe(true)
  })

  test('boca abajo solo se ve lo que se ha tocado', () => {
    const tablero = tableroDe(true)
    const tocada = tablero.cartas[0]
    const despues = tocar(tablero, tocada.id).tablero

    expect(estaVisible(tablero, tocada)).toBe(false)
    expect(estaVisible(despues, tocada)).toBe(true)
    for (const carta of despues.cartas.filter((c) => c.id !== tocada.id)) {
      expect(estaVisible(despues, carta)).toBe(false)
    }
  })

  test('boca abajo, la pareja hecha se queda a la vista y la fallada no', () => {
    const tablero = tableroDe(true)
    const pieza = tablero.cartas[0].pieza
    const [una, otra] = parejaDe(tablero, pieza)
    const hecha = tocar(tocar(tablero, una).tablero, otra).tablero

    expect(hecha.cartas.filter((carta) => estaVisible(hecha, carta))).toHaveLength(2)

    const [x, y] = desparejadas(hecha)
    const fallada = recoger(tocar(tocar(hecha, x).tablero, y).tablero)

    // Solo siguen a la vista las dos de la pareja hecha.
    expect(fallada.cartas.filter((carta) => estaVisible(fallada, carta))).toHaveLength(2)
  })
})

describe('cuándo se juega boca abajo', () => {
  test('las primeras partidas del nivel van destapadas', () => {
    for (let hechas = 0; hechas < BOCA_ABAJO_DESDE; hechas++) {
      expect(juegaBocaAbajo(hechas)).toBe(false)
    }
  })

  test('a partir de ahí se juega boca abajo, sin preguntar', () => {
    expect(juegaBocaAbajo(BOCA_ABAJO_DESDE)).toBe(true)
    expect(juegaBocaAbajo(BOCA_ABAJO_DESDE + 3)).toBe(true)
  })

  test('el modo cambia dentro del nivel, no al acabarlo', () => {
    // Si el corte cayera en el límite del nivel, en la v1 —que entrega un solo
    // nivel— el modo no llegaría a aparecer nunca.
    const [primero] = NIVELES.emparejar

    expect(BOCA_ABAJO_DESDE).toBeGreaterThan(0)
    expect(BOCA_ABAJO_DESDE).toBeLessThan(primero.partidas)
  })

  test('cada vuelta al último nivel vuelve a calentar destapada', () => {
    const vuelta = NIVELES.emparejar.reduce((total, nivel) => total + nivel.partidas, 0)

    expect(juegaBocaAbajo(vuelta)).toBe(false)
    expect(juegaBocaAbajo(vuelta + BOCA_ABAJO_DESDE)).toBe(true)
  })
})

describe('a quién señala la pista', () => {
  // La pista de esta mecánica no sabe a qué señalar en el momento de fallar:
  // fallar es que dos cartas no eran pareja, y ninguna de las dos era «la
  // buena». La respuesta aparece después, cuando el niño levanta una sola.

  test('con una carta levantada, señala a su pareja', () => {
    const tablero = tableroDe(true)
    const [una, otra] = parejaDe(tablero, tablero.cartas[0].pieza)

    expect(parejaPendiente(tocar(tablero, una).tablero)).toBe(otra)
    expect(parejaPendiente(tocar(tablero, otra).tablero)).toBe(una)
  })

  test('sin nada levantado no hay nada que señalar', () => {
    expect(parejaPendiente(tableroDe(true))).toBe(null)
  })

  test('con la pareja fallada a la vista tampoco', () => {
    // Hay dos cartas levantadas y ninguna es la buena: señalar a cualquiera de
    // las dos sería mentir.
    let tablero = tableroDe(true)
    const [una, otra] = desparejadas(tablero)
    tablero = tocar(tablero, una).tablero
    tablero = tocar(tablero, otra).tablero

    expect(parejaPendiente(tablero)).toBe(null)
  })

  test('después de acertar deja de señalar', () => {
    let tablero = tableroDe(true)
    const [una, otra] = parejaDe(tablero, tablero.cartas[0].pieza)
    tablero = tocar(tablero, una).tablero
    tablero = tocar(tablero, otra).tablero

    expect(parejaPendiente(tablero)).toBe(null)
  })
})
