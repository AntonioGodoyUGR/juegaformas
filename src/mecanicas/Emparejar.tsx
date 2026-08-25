import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Guia } from '../componentes/Guia'
import { useSonido } from '../estado/audio'
import { useTextos } from '../estado/juego'
import {
  type Carta as Naipe,
  crearTablero,
  esperando,
  estaEmparejada,
  estaTerminado,
  estaVisible,
  parejaPendiente,
  recoger,
  tocar,
} from '../lib/emparejar'
import type { Partida } from '../lib/partida'
import { SIN_PISTA, acertar, fallar, hayPista } from '../lib/pista'
import { Pieza } from '../piezas'
import { Chispa } from '../piezas/chispa'
import { SENAL } from './senal'

/**
 * El tablero de `emparejar`: las cartas en rejilla y el niño tocando las que
 * van juntas. Las reglas están en `src/lib/emparejar.ts`; esto solo pinta.
 *
 * Boca abajo no tiene componente propio, igual que no tiene tablero propio: es
 * la misma pantalla con `bocaAbajo` puesto. Lo que cambia es si una carta que
 * nadie ha tocado enseña su dibujo, y esa pregunta la responde `estaVisible`.
 *
 * Como en `encajar`, el tablero no se reinicia solo cuando cambia la partida:
 * quien lo monta le pone una `key`.
 *
 * La rejilla es siempre de dos filas, tantas columnas como parejas. No es un
 * ajuste automático a propósito: con seis parejas y las cartas colocándose
 * solas saldrían cuatro y cuatro y cuatro, y un tablero de memoria en el que
 * las filas cambian de longitud según cuántas piezas toquen es un tablero que
 * hay que volver a mirar entero cada partida. Dos filas siempre, y las cartas
 * se estrechan lo que haga falta para caber.
 */
export function Emparejar({
  partida,
  bocaAbajo,
  alTerminar,
}: {
  partida: Partida
  bocaAbajo: boolean
  alTerminar: () => void
}) {
  const textos = useTextos()
  const sonar = useSonido()
  const [tablero, setTablero] = useState(() => crearTablero(partida, bocaAbajo))
  const [pista, setPista] = useState(SIN_PISTA)

  // Cuando hay una pareja fallada a la vista, se recoge sola. El rato que se
  // queda es lo que el niño necesita para mirar qué ha salido —boca abajo eso
  // *es* el juego—, y que se recoja sola evita el único gesto que sobra: tener
  // que tocar para seguir.
  useEffect(() => {
    if (!esperando(tablero)) return
    const espera = setTimeout(() => setTablero(recoger), PAUSA_FALLO)
    return () => clearTimeout(espera)
  }, [tablero])

  function alTocar(carta: string) {
    const resultado = tocar(tablero, carta)
    if (resultado.tablero === tablero) return

    // Se cuentan parejas falladas, no toques: levantar la primera carta no es
    // fallar nada todavía.
    if (resultado.toque === 'fallo') setPista((anterior) => fallar(anterior))
    if (resultado.toque === 'acierto') {
      setPista(acertar)
      sonar('acierto')
    }

    setTablero(resultado.tablero)
    if (estaTerminado(resultado.tablero)) alTerminar()
  }

  // A quién señalar: a la pareja de la única carta levantada. Mientras no haya
  // exactamente una levantada no hay nada que señalar, así que la pista de esta
  // mecánica va apareciendo con el juego en vez de quedarse fija en pantalla.
  const senalada = hayPista(pista) ? parejaPendiente(tablero) : null

  const parejas = partida.piezas.length

  return (
    <div className="relative flex h-full items-center justify-center p-4">
      <div
        className="grid grid-cols-[repeat(var(--columnas),var(--carta))] justify-center gap-4 sm:gap-6"
        style={escalaDeCarta(parejas)}
      >
        {tablero.cartas.map((carta) => (
          <Carta
            key={carta.id}
            carta={carta}
            visible={estaVisible(tablero, carta)}
            hecha={estaEmparejada(tablero, carta.pieza)}
            nombre={textos.piezas[carta.pieza]}
            tapada={textos.cartaTapada}
            senalada={carta.id === senalada}
            pareja={textos.pista.pareja}
            alTocar={alTocar}
          />
        ))}
      </div>

      <Guia senalando={hayPista(pista)} />
    </div>
  )
}

/**
 * Cuánto se queda a la vista una pareja fallada. Suficiente para mirar las dos
 * cartas y quedarse con dónde estaban, que es lo que se aprende jugando boca
 * abajo, y no tanto como para que el niño se canse esperando.
 */
const PAUSA_FALLO = 1200

/** Lo que separa dos cartas en pantalla grande, en píxeles. Es el `gap-6` de la rejilla. */
const SEPARACION = 24

/**
 * Cuánto mide una carta y cuántas columnas hay, cuando el tablero trae
 * `parejas` piezas distintas.
 *
 * Los topes son los de `encajar` y por lo mismo: el tamaño de siempre mientras
 * quepa, el ancho repartido entre las columnas cuando no, y la altura, que aquí
 * aprieta antes porque las dos filas están siempre llenas.
 */
function escalaDeCarta(parejas: number): CSSProperties {
  const reparto = `(94vw - ${(parejas - 1) * SEPARACION}px) / ${parejas}`

  return {
    '--columnas': parejas,
    '--carta': `min(9rem, ${reparto}, 38vh)`,
  } as CSSProperties
}

/**
 * Una carta. La misma en los dos modos: lo único que cambia es si enseña el
 * dibujo o el reverso.
 *
 * Una pareja hecha se queda a la vista y deja de responder al toque. Va
 * `disabled` y no solo ignorada: así también sale del recorrido del teclado, y
 * quien juega tabulando no vuelve a pasar por lo que ya ha resuelto.
 */
function Carta({
  carta,
  visible,
  hecha,
  nombre,
  tapada,
  senalada,
  pareja,
  alTocar,
}: {
  carta: Naipe
  visible: boolean
  hecha: boolean
  nombre: string
  tapada: string
  senalada: boolean
  pareja: (nombre: string) => string
  alTocar: (carta: string) => void
}) {
  // Tapada y señalada sigue sin decir qué pieza es: la pista dice dónde está la
  // pareja, no cuál es. Eso lo descubre el niño al tocarla, que es el gesto que
  // la pista no le quita.
  const etiqueta = visible ? nombre : tapada

  return (
    <button
      type="button"
      data-carta={carta.id}
      data-pista={senalada ? 'true' : undefined}
      disabled={hecha}
      // Con el dibujo a la vista, la carta se llama como la pieza; tapada, el
      // nombre sería el juego resuelto para quien no mira la pantalla.
      aria-label={senalada ? pareja(etiqueta) : etiqueta}
      onClick={() => alTocar(carta.id)}
      className={`flex size-[var(--carta)] items-center justify-center rounded-3xl transition-colors ${
        hecha ? 'bg-hondo' : visible ? 'bg-white' : 'bg-suelo'
      } ${senalada ? SENAL : ''}`}
    >
      {visible ? <Pieza id={carta.pieza} className="size-full" decorativa /> : <Reverso />}
    </button>
  )
}

/**
 * El reverso: la misma chispa en todas las cartas. Es lo contrario de una
 * pieza a propósito —un solo dibujo, repetido, igual en las diez—, para que
 * desde el otro lado de la mesa se vea de un vistazo cuánto queda por
 * descubrir.
 *
 * Antes era un rectángulo de color liso y nada más. La chispa dice lo mismo
 * —«esto está tapado»— y además dice dónde estás: es la misma que hay en el
 * cielo del fondo.
 */
function Reverso() {
  return <Chispa className="size-[62%]" />
}
