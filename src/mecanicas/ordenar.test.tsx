import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import { ProveedorDeJuego } from '../estado/juego'
import type { Criterio } from '../lib/ordenar'
import { generarPartida } from '../lib/partida'
import { FALLOS_PARA_PISTA } from '../lib/pista'
import { textosDe } from '../textos'
import { Ordenar } from './Ordenar'

/**
 * El tablero de ordenar visto como lo usa un niño: coger un eslabón de la
 * bandeja, llevarlo a un sitio de la secuencia y soltarlo.
 *
 * jsdom no maqueta: todo mide cero y está en el origen. Como «cerca es
 * suficiente» es geometría, aquí se le pone una medida a mano a cada elemento;
 * sin eso no hay nada que probar salvo que los componentes se montan.
 *
 * Lo que jsdom sí conserva es el `style` en línea, y ahí es donde vive la
 * escalera: los `em` de cada sitio y de cada ficha se pueden leer y comparar,
 * que es la única forma de comprobar sin ojos que la rampa crece.
 */

/** Todo cuadrado y del mismo tamaño, que es lo que jsdom cree que mide. */
const LADO = 100
/** Separación entre sitios, mayor que la tolerancia para que no haya empates. */
const SITIO_A_SITIO = 200

const textos = textosDe('es')
type Punto = { readonly x: number; readonly y: number }

const puntos = new WeakMap<Element, Punto>()
const ORIGEN: Punto = { x: 0, y: 0 }

/** Los tres grados de un nivel de tres piezas, del inicio al fin. */
const GRADOS = [1, 2, 3]

function montar(criterio: Criterio, alTerminar = () => {}) {
  // Lo que mide cada cosa. Lo que no se ha colocado —la capa donde viaja el
  // eslabón mientras el dedo lo lleva, que `@dnd-kit` crea al empezar— se queda
  // en el origen, y por eso los arrastres se cuentan desde (0, 0).
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: Element,
  ) {
    const punto = puntos.get(this) ?? ORIGEN
    return new DOMRect(punto.x, punto.y, LADO, LADO)
  })

  // `() => 0` fija el sorteo de la partida: siempre la misma pieza. El orden de
  // la bandeja lo baraja la mecánica por su cuenta y da igual cuál salga: los
  // eslabones se buscan por su grado, no por dónde estén.
  const partida = generarPartida('ordenar', 'espacio', 0, () => 0)

  render(
    <ProveedorDeJuego preferencias={['es']}>
      <Ordenar partida={partida} criterio={criterio} alTerminar={alTerminar} />
    </ProveedorDeJuego>,
  )

  colocarSitios()
  return textos.piezas[partida.piezas[0].id]
}

/** Los sitios en fila. Hay que rehacerlo tras cada acierto: el tablero repinta. */
function colocarSitios() {
  const puestos = new Map<number, Punto>()

  document.querySelectorAll('[data-sitio]').forEach((elemento, i) => {
    const punto = { x: i * SITIO_A_SITIO, y: 0 }
    puntos.set(elemento, punto)
    puestos.set(Number(elemento.getAttribute('data-sitio')), punto)
  })

  return puestos
}

const sitio = (grado: number) => document.querySelector(`[data-sitio="${grado}"]`)
const eslabon = (grado: number) => document.querySelector(`[data-eslabon="${grado}"]`)

/** Cómo se llama un eslabón, que es como se llama su sitio en cuanto se llena. */
function nombre(criterio: Criterio, pieza: string, grado: number) {
  return criterio === 'tamano'
    ? textos.orden.tamano(pieza, grado, GRADOS.length)
    : textos.orden.cantidad(pieza, grado)
}

/** Cuánto ocupa algo en pantalla, en `em`, según su `style` en línea. */
function ancho(elemento: Element | null) {
  return Number.parseFloat((elemento as HTMLElement).style.width)
}

/**
 * Arrastra un eslabón y lo suelta en un punto. El punto se da como un sitio más
 * un desvío en píxeles, que es como se dice «se ha quedado corto» sin depender
 * de dónde caiga el tablero.
 */
function arrastrar(grado: number, destino: { hasta?: number; desviado?: Punto }) {
  const sitios = colocarSitios()
  const cogido = eslabon(grado)
  if (!cogido) throw new Error(`el eslabón ${grado} no está en la bandeja`)

  const referencia = destino.hasta ? sitios.get(destino.hasta)! : ORIGEN
  const desvio = destino.desviado ?? ORIGEN
  const llegada = { x: referencia.x + desvio.x, y: referencia.y + desvio.y }

  fireEvent.pointerDown(cogido, { button: 0, isPrimary: true, clientX: 0, clientY: 0 })
  // El primer movimiento solo pasa de los ocho píxeles que separan un arrastre
  // de un toque; sin él, el eslabón ni se levanta.
  fireEvent.pointerMove(document, { clientX: 20, clientY: 0 })
  fireEvent.pointerMove(document, { clientX: llegada.x, clientY: llegada.y })
  fireEvent.pointerUp(document, { clientX: llegada.x, clientY: llegada.y })
}

/** Un eslabón está colocado cuando sale de la bandeja y su sitio lo nombra. */
function colocado(criterio: Criterio, pieza: string, grado: number) {
  return (
    eslabon(grado) === null &&
    sitio(grado)?.getAttribute('aria-label') === nombre(criterio, pieza, grado)
  )
}

/** Un punto por debajo de la fila de sitios, lejos de todos. */
const NINGUNA_PARTE: Punto = { x: SITIO_A_SITIO, y: 4 * LADO }

describe('la escalera', () => {
  test('los sitios van del inicio al fin, y cada uno es mayor que el anterior', () => {
    montar('tamano')

    const sitios = [...document.querySelectorAll('[data-sitio]')]
    expect(sitios.map((elemento) => Number(elemento.getAttribute('data-sitio')))).toEqual(GRADOS)

    // La rampa es lo único que dice hacia dónde va la secuencia. Si dejara de
    // crecer, el tablero tendría dos soluciones razonables y solo una contaría.
    const anchos = sitios.map(ancho)
    for (let i = 1; i < anchos.length; i++) expect(anchos[i]).toBeGreaterThan(anchos[i - 1])
  })

  test('un sitio vacío se llama por su número y no por lo que va dentro', () => {
    const pieza = montar('tamano')

    for (const grado of GRADOS) {
      const etiqueta = sitio(grado)!.getAttribute('aria-label')
      expect(etiqueta).toBe(textos.orden.sitio(grado, GRADOS.length))
      expect(etiqueta).not.toContain(pieza)
    }
  })

  test('la bandeja trae un eslabón por sitio', () => {
    const pieza = montar('tamano')

    for (const grado of GRADOS) {
      expect(
        screen.getByRole('button', { name: nombre('tamano', pieza, grado) }),
      ).toBeInTheDocument()
    }
  })
})

describe('los dos criterios', () => {
  test('por tamaño, cada eslabón es un dibujo, y crecen', () => {
    montar('tamano')

    const anchos = GRADOS.map((grado) => {
      expect(eslabon(grado)!.querySelectorAll('svg')).toHaveLength(1)
      return ancho(eslabon(grado))
    })
    for (let i = 1; i < anchos.length; i++) expect(anchos[i]).toBeGreaterThan(anchos[i - 1])
  })

  test('por cantidad, cada eslabón es la pieza repetida y todos ocupan lo mismo', () => {
    montar('cantidad')

    for (const grado of GRADOS) {
      expect(eslabon(grado)!.querySelectorAll('svg')).toHaveLength(grado)
    }
    // Si la ficha creciera con la cantidad, el niño emparejaría tamaños con la
    // escalera y llegaría al final sin haber contado nada.
    const anchos = GRADOS.map((grado) => ancho(eslabon(grado)))
    expect(new Set(anchos).size).toBe(1)
  })

  test('el dibujo de dentro no se nombra: ya lo nombra el eslabón', () => {
    const pieza = montar('cantidad')

    // Tres dibujos iguales dentro de un eslabón se anunciarían como la misma
    // pieza tres veces seguidas.
    expect(screen.queryAllByRole('img', { name: pieza })).toHaveLength(0)
  })
})

describe('colocar un eslabón', () => {
  test('llevarlo a su sitio lo coloca', () => {
    const pieza = montar('tamano')

    arrastrar(1, { hasta: 1 })

    expect(colocado('tamano', pieza, 1)).toBe(true)
  })

  test('se puede empezar por donde sea, no hay que ir en orden', () => {
    const pieza = montar('tamano')

    arrastrar(3, { hasta: 3 })
    arrastrar(2, { hasta: 2 })

    expect(colocado('tamano', pieza, 3)).toBe(true)
    expect(colocado('tamano', pieza, 2)).toBe(true)
  })

  test('quedarse corto también vale: no hay que apuntar', () => {
    const pieza = montar('tamano')

    // Muy por encima del sitio, sin llegar a tocarlo. Un dedo de cinco años no
    // apunta mejor que esto, y el juego no se lo tiene en cuenta.
    arrastrar(2, { hasta: 2, desviado: { x: 0, y: -140 } })

    expect(colocado('tamano', pieza, 2)).toBe(true)
  })

  test('en el sitio equivocado no entra', () => {
    const pieza = montar('tamano')

    arrastrar(1, { hasta: 2 })

    expect(colocado('tamano', pieza, 1)).toBe(false)
    expect(eslabon(1)).toBeInTheDocument()
    expect(sitio(2)!.getAttribute('aria-label')).toBe(textos.orden.sitio(2, GRADOS.length))
  })

  test('soltarlo lejos de todo no lo coloca en ningún sitio', () => {
    const pieza = montar('tamano')

    arrastrar(2, { desviado: NINGUNA_PARTE })

    for (const grado of GRADOS) expect(colocado('tamano', pieza, grado)).toBe(false)
  })

  test('equivocarse devuelve el eslabón en silencio y se puede reintentar', () => {
    const pieza = montar('tamano')

    arrastrar(1, { hasta: 3 })

    // Nada de reproches en pantalla. Lo único que se dice es lo que `@dnd-kit`
    // anuncia a quien no ve el tablero, y lo que dice es que el eslabón se ha
    // vuelto a su sitio: dónde está, no que se haya fallado.
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(textos.arrastre.devuelta)

    arrastrar(1, { hasta: 1 })
    expect(colocado('tamano', pieza, 1)).toBe(true)
  })

  test('un eslabón colocado deja su sitio vacío en la bandeja', () => {
    montar('tamano')

    arrastrar(1, { hasta: 1 })

    // No se recoge la bandeja al acertar: si las fichas se recolocan, la
    // siguiente que el niño iba a coger se le mueve debajo del dedo.
    expect(eslabon(1)).toBeNull()
    expect(document.querySelectorAll('[data-sitio]')).toHaveLength(GRADOS.length)
  })
})

describe('terminar', () => {
  test('la secuencia se acaba cuando están todos, y ni uno antes', () => {
    const alTerminar = vi.fn()
    montar('cantidad', alTerminar)

    for (const grado of GRADOS.slice(0, -1)) {
      arrastrar(grado, { hasta: grado })
      expect(alTerminar).not.toHaveBeenCalled()
    }
    arrastrar(GRADOS[GRADOS.length - 1], { hasta: GRADOS[GRADOS.length - 1] })

    expect(alTerminar).toHaveBeenCalledTimes(1)
  })

  test('fallar por el camino no adelanta el final', () => {
    const alTerminar = vi.fn()
    montar('tamano', alTerminar)

    for (const grado of GRADOS) arrastrar(grado, { desviado: NINGUNA_PARTE })

    expect(alTerminar).not.toHaveBeenCalled()
  })
})

describe('la pista', () => {
  /** El sitio que está señalado ahora mismo, si hay alguno. */
  const senalado = () => document.querySelector('[data-pista]')

  /** Se atasca: lleva un eslabón a un sitio que no es el suyo, varias veces. */
  function atascarse(grado: number, donde: number, veces = FALLOS_PARA_PISTA) {
    for (let i = 0; i < veces; i++) arrastrar(grado, { hasta: donde })
  }

  test('un fallo no es estar atascado: todavía no se señala nada', () => {
    montar('tamano')

    atascarse(1, 3, FALLOS_PARA_PISTA - 1)

    expect(senalado()).toBeNull()
  })

  test('tras varios fallos se señala el sitio del eslabón que está intentando', () => {
    montar('tamano')

    atascarse(1, 3)

    expect(senalado()?.getAttribute('data-sitio')).toBe('1')
  })

  test('el sitio señalado también lo dice en voz alta', () => {
    montar('tamano')

    atascarse(2, 3)

    expect(senalado()?.getAttribute('aria-label')).toBe(
      textos.pista.destino(textos.orden.sitio(2, GRADOS.length)),
    )
  })

  test('señalar no coloca el eslabón ni acaba la secuencia: lo lleva él', () => {
    const alTerminar = vi.fn()
    const pieza = montar('tamano', alTerminar)

    atascarse(1, 3)

    expect(colocado('tamano', pieza, 1)).toBe(false)
    expect(eslabon(1)).toBeInTheDocument()
    expect(alTerminar).not.toHaveBeenCalled()

    arrastrar(1, { hasta: 1 })
    expect(colocado('tamano', pieza, 1)).toBe(true)
  })

  test('acertar borra la cuenta: hay que volver a atascarse', () => {
    montar('tamano')

    atascarse(1, 3, FALLOS_PARA_PISTA - 1)
    arrastrar(1, { hasta: 1 })

    expect(senalado()).toBeNull()

    atascarse(2, 3, FALLOS_PARA_PISTA - 1)
    expect(senalado()).toBeNull()
  })
})
