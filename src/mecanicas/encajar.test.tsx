import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { ProveedorDeJuego } from '../estado/juego'
import { generarPartida } from '../lib/partida'
import { FALLOS_PARA_PISTA } from '../lib/pista'
import { textosDe } from '../textos'
import { Encajar } from './Encajar'

/**
 * El tablero de encajar visto como lo usa un niño: coger una pieza con el dedo,
 * llevarla a un sitio y soltarla.
 *
 * jsdom no maqueta: todo mide cero y está en el origen. Como «cerca es
 * suficiente» es geometría, aquí se le pone una medida a mano a cada elemento;
 * sin eso no hay nada que probar salvo que los componentes se montan.
 */

/** Todo cuadrado y del mismo tamaño: piezas y huecos lo son en pantalla. */
const LADO = 100
/** Separación entre huecos, mayor que la tolerancia para que no haya empates. */
const HUECO_A_HUECO = 200

const textos = textosDe('es')
type Sitio = { readonly x: number; readonly y: number }

const sitios = new WeakMap<Element, Sitio>()
const ORIGEN: Sitio = { x: 0, y: 0 }

function montar(alTerminar = () => {}) {
  // Lo que mide cada cosa. Lo que no se ha colocado —la capa donde viaja la
  // pieza mientras el dedo la lleva, que `@dnd-kit` crea al empezar— se queda
  // en el origen, y por eso los arrastres se cuentan desde (0, 0).
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    const sitio = sitios.get(this) ?? ORIGEN
    return new DOMRect(sitio.x, sitio.y, LADO, LADO)
  })

  // `() => 0` fija el sorteo: siempre las mismas tres piezas, en el mismo orden.
  const partida = generarPartida('encajar', 'espacio', 'facil', () => 0)

  render(
    <ProveedorDeJuego preferencias={['es']}>
      <Encajar partida={partida} alTerminar={alTerminar} />
    </ProveedorDeJuego>,
  )

  colocarHuecos()
  return partida.piezas.map((pieza) => pieza.id)
}

/** Los huecos en fila. Hay que rehacerlo tras cada acierto: el tablero repinta. */
function colocarHuecos() {
  const puestos = new Map<string, Sitio>()

  document.querySelectorAll('[data-hueco]').forEach((elemento, i) => {
    const sitio = { x: i * HUECO_A_HUECO, y: 0 }
    sitios.set(elemento, sitio)
    puestos.set(elemento.getAttribute('data-hueco')!, sitio)
  })

  return puestos
}

function ficha(pieza: string) {
  return document.querySelector(`[data-ficha="${pieza}"]`)
}

/**
 * Arrastra una pieza y la suelta en un punto. El punto se da como un hueco más
 * un desvío en píxeles, que es como se dice «se ha quedado corto» sin depender
 * de dónde caiga el tablero.
 */
function arrastrar(pieza: string, destino: { hasta?: string; desviado?: Sitio }) {
  const huecos = colocarHuecos()
  const agarrada = ficha(pieza)
  if (!agarrada) throw new Error(`${pieza} no está en la bandeja`)

  const referencia = destino.hasta ? huecos.get(destino.hasta)! : ORIGEN
  const desvio = destino.desviado ?? ORIGEN
  const llegada = { x: referencia.x + desvio.x, y: referencia.y + desvio.y }

  fireEvent.pointerDown(agarrada, { button: 0, isPrimary: true, clientX: 0, clientY: 0 })
  // El primer movimiento solo pasa de los ocho píxeles que separan un arrastre
  // de un toque; sin él, la pieza ni se levanta.
  fireEvent.pointerMove(document, { clientX: 20, clientY: 0 })
  fireEvent.pointerMove(document, { clientX: llegada.x, clientY: llegada.y })
  fireEvent.pointerUp(document, { clientX: llegada.x, clientY: llegada.y })
}

/** Una pieza está encajada cuando ya no está en la bandeja y su hueco la nombra. */
function encajada(pieza: string) {
  return ficha(pieza) === null && screen.queryByRole('img', { name: textos.piezas[pieza] }) !== null
}

/** Un punto por debajo de la fila de huecos, lejos de todos. */
const NINGUNA_PARTE: Sitio = { x: HUECO_A_HUECO, y: 4 * LADO }

describe('el tablero', () => {
  test('reparte un hueco y una ficha por pieza', () => {
    const piezas = montar()

    expect(document.querySelectorAll('[data-hueco]')).toHaveLength(piezas.length)
    for (const pieza of piezas) {
      expect(screen.getByRole('button', { name: textos.piezas[pieza] })).toBeInTheDocument()
    }
  })
})

describe('arrastrar una pieza', () => {
  test('llevarla a su hueco la encaja', () => {
    const [pieza] = montar()

    arrastrar(pieza, { hasta: pieza })

    expect(encajada(pieza)).toBe(true)
  })

  test('quedarse corto también vale: no hay que apuntar', () => {
    const [pieza] = montar()

    // Cuarenta píxeles por encima del hueco, sin llegar a tocarlo. Un dedo de
    // cinco años no apunta mejor que esto, y el juego no se lo tiene en cuenta.
    arrastrar(pieza, { hasta: pieza, desviado: { x: 0, y: -140 } })

    expect(encajada(pieza)).toBe(true)
  })

  test('en el hueco de otra pieza no entra', () => {
    const [pieza, otra] = montar()

    arrastrar(pieza, { hasta: otra })

    expect(encajada(pieza)).toBe(false)
    expect(ficha(pieza)).toBeInTheDocument()
  })

  test('soltarla lejos de todo no la encaja en ningún sitio', () => {
    const piezas = montar()

    arrastrar(piezas[0], { desviado: NINGUNA_PARTE })

    for (const pieza of piezas) expect(encajada(pieza)).toBe(false)
  })

  test('fallar no bloquea: se puede volver a intentar', () => {
    const [pieza, otra] = montar()

    arrastrar(pieza, { hasta: otra })
    arrastrar(pieza, { hasta: pieza })

    expect(encajada(pieza)).toBe(true)
  })

  test('fallar no dice nada: no hay aviso ni error en pantalla', () => {
    const [pieza, otra] = montar()

    arrastrar(pieza, { hasta: otra })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('una pieza ya encajada deja su sitio vacío en la bandeja', () => {
    const [pieza] = montar()

    arrastrar(pieza, { hasta: pieza })

    // No se recoge la bandeja al acertar: si las fichas se recolocan, la
    // siguiente que el niño iba a coger se le mueve debajo del dedo.
    expect(ficha(pieza)).toBeNull()
    expect(document.querySelectorAll('[data-hueco]')).toHaveLength(3)
  })
})

describe('terminar', () => {
  test('el tablero se acaba cuando están todas, y ni una antes', () => {
    const alTerminar = vi.fn()
    const piezas = montar(alTerminar)

    for (const pieza of piezas.slice(0, -1)) {
      arrastrar(pieza, { hasta: pieza })
      expect(alTerminar).not.toHaveBeenCalled()
    }
    arrastrar(piezas[piezas.length - 1], { hasta: piezas[piezas.length - 1] })

    expect(alTerminar).toHaveBeenCalledTimes(1)
  })

  test('fallar por el camino no adelanta el final', () => {
    const alTerminar = vi.fn()
    const piezas = montar(alTerminar)

    for (const pieza of piezas) arrastrar(pieza, { desviado: NINGUNA_PARTE })

    expect(alTerminar).not.toHaveBeenCalled()
  })
})

describe('la pista', () => {
  /** El hueco que está señalado ahora mismo, si hay alguno. */
  const senalado = () => document.querySelector('[data-pista]')

  /** Se atasca: intenta meter una pieza donde no va, tantas veces como se diga. */
  function atascarse(pieza: string, donde: string, veces = FALLOS_PARA_PISTA) {
    for (let i = 0; i < veces; i++) arrastrar(pieza, { hasta: donde })
  }

  test('un fallo no es estar atascado: todavía no se señala nada', () => {
    const [pieza, otra] = montar()

    atascarse(pieza, otra, FALLOS_PARA_PISTA - 1)

    expect(senalado()).toBeNull()
  })

  test('tras varios fallos se señala el hueco de la pieza que está intentando', () => {
    const [pieza, otra] = montar()

    atascarse(pieza, otra)

    expect(senalado()?.getAttribute('data-hueco')).toBe(pieza)
  })

  test('el hueco señalado también lo dice en voz alta', () => {
    // Un destello no se oye. Sin esto, un niño que juega con lector de pantalla
    // sería el único que no sale del atasco.
    const [pieza, otra] = montar()

    atascarse(pieza, otra)

    expect(senalado()?.getAttribute('aria-label')).toBe(
      textos.pista.destino(textos.piezas[pieza]),
    )
  })

  test('señalar no encaja la pieza ni acaba el tablero: la lleva él', () => {
    const alTerminar = vi.fn()
    const [pieza, otra] = montar(alTerminar)

    atascarse(pieza, otra)

    expect(encajada(pieza)).toBe(false)
    expect(ficha(pieza)).toBeInTheDocument()
    expect(alTerminar).not.toHaveBeenCalled()

    arrastrar(pieza, { hasta: pieza })
    expect(encajada(pieza)).toBe(true)
  })

  test('la pista sigue a la pieza que el niño tiene en la mano', () => {
    const [pieza, otra, tercera] = montar()

    atascarse(pieza, otra, FALLOS_PARA_PISTA - 1)
    arrastrar(otra, { hasta: tercera })

    // Se atascó con una y cambió a otra: lo que se señala es lo que está
    // intentando ahora, no lo que intentaba hace tres fallos.
    expect(senalado()?.getAttribute('data-hueco')).toBe(otra)
  })

  test('acertar borra la cuenta: hay que volver a atascarse', () => {
    const [pieza, otra, tercera] = montar()

    atascarse(pieza, otra, FALLOS_PARA_PISTA - 1)
    arrastrar(pieza, { hasta: pieza })

    expect(senalado()).toBeNull()

    atascarse(otra, tercera, FALLOS_PARA_PISTA - 1)
    expect(senalado()).toBeNull()
  })
})
