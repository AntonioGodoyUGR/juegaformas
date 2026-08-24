import { useEffect, useState } from 'react'
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
    if (resultado.toque === 'acierto') setPista(acertar)

    setTablero(resultado.tablero)
    if (estaTerminado(resultado.tablero)) alTerminar()
  }

  // A quién señalar: a la pareja de la única carta levantada. Mientras no haya
  // exactamente una levantada no hay nada que señalar, así que la pista de esta
  // mecánica va apareciendo con el juego en vez de quedarse fija en pantalla.
  const senalada = hayPista(pista) ? parejaPendiente(tablero) : null

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex max-w-2xl flex-wrap items-center justify-center gap-4 sm:gap-6">
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
    </div>
  )
}

/**
 * Cuánto se queda a la vista una pareja fallada. Suficiente para mirar las dos
 * cartas y quedarse con dónde estaban, que es lo que se aprende jugando boca
 * abajo, y no tanto como para que el niño se canse esperando.
 */
const PAUSA_FALLO = 1200

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
      className={`flex size-28 items-center justify-center rounded-3xl transition-colors sm:size-36 ${
        hecha ? 'bg-purple-100' : visible ? 'bg-white' : 'bg-purple-400'
      } ${senalada ? SENAL : ''}`}
    >
      {visible ? <Pieza id={carta.pieza} className="size-full" decorativa /> : <Reverso />}
    </button>
  )
}

/**
 * El reverso: un color liso y nada más. Es lo contrario de una pieza a
 * propósito —sin dibujo, sin trazo, sin detalle—, para que desde el otro lado
 * de la mesa se vea de un vistazo cuánto queda por descubrir.
 */
function Reverso() {
  return <div className="size-full rounded-3xl bg-purple-400" aria-hidden="true" />
}
