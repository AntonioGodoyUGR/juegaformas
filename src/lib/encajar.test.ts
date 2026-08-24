import { describe, expect, test } from 'vitest'
import {
  type Diana,
  type Recuadro,
  TOLERANCIA,
  crearTablero,
  estaTerminado,
  huecoMasCercano,
  soltar,
} from './encajar'
import { generarPartida } from './partida'

const partida = () => generarPartida('encajar', 'espacio', 0, () => 0)

/** Un recuadro de 100 con la esquina donde se le diga. */
const caja = (x: number, y: number, lado = 100): Recuadro => ({ x, y, ancho: lado, alto: lado })

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

describe('a qué hueco va la pieza', () => {
  // Dos huecos de 100 bien separados, para que entre ellos quede una zona de
  // nadie: con la tolerancia al 60% de 100, hay sitio para soltar y fallar.
  const huecos: readonly Diana[] = [
    { id: 'izquierda', recuadro: caja(0, 0) },
    { id: 'derecha', recuadro: caja(500, 0) },
  ]

  test('encima del hueco', () => {
    expect(huecoMasCercano(caja(0, 0), huecos)).toBe('izquierda')
  })

  test('solapando un poco ya vale', () => {
    expect(huecoMasCercano(caja(80, 20), huecos)).toBe('izquierda')
  })

  test('cerca sin tocar también vale', () => {
    // 40 de hueco entre los dos recuadros, con 60 de tolerancia sobre un
    // hueco de 100. Un niño que se queda corto encaja igual.
    expect(huecoMasCercano(caja(140, 0), huecos)).toBe('izquierda')
  })

  test('lejos de todo no vale', () => {
    // Soltada en tierra de nadie: 100 de separación a cada lado, muy por
    // encima de los 60 que se perdonan. Sin este caso la pieza siempre
    // encontraría sitio y la mecánica se resolvería sola.
    expect(huecoMasCercano(caja(200, 0), huecos)).toBe(null)
  })

  test('la tolerancia se mide en tamaños de hueco, no en píxeles', () => {
    // La misma separación de 100, contra un hueco del doble de tamaño. En
    // casillas de 200 son media casilla y se perdona; en casillas de 100 es
    // una casilla entera y no. La puntería de un dedo se mide así, no en
    // píxeles, para que el juego se comporte igual en una tablet y en una
    // ventana pequeña.
    const grandes: readonly Diana[] = [{ id: 'grande', recuadro: caja(0, 0, 200) }]

    expect(huecoMasCercano(caja(300, 0, 200), grandes)).toBe('grande')
    expect(huecoMasCercano(caja(200, 0), huecos)).toBe(null)
  })

  test('entre dos huecos gana el de centro más cercano', () => {
    const pegados: readonly Diana[] = [
      { id: 'izquierda', recuadro: caja(0, 0) },
      { id: 'derecha', recuadro: caja(100, 0) },
    ]

    expect(huecoMasCercano(caja(60, 0), pegados)).toBe('derecha')
    expect(huecoMasCercano(caja(40, 0), pegados)).toBe('izquierda')
  })

  test('sin huecos no hay hueco', () => {
    expect(huecoMasCercano(caja(0, 0), [])).toBe(null)
  })

  test('la tolerancia es generosa de verdad', () => {
    // Si alguien la baja a algo con lo que un adulto tiene que apuntar, este
    // test es el que se queja.
    expect(TOLERANCIA).toBeGreaterThanOrEqual(0.5)
  })
})
