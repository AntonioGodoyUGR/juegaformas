import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Volver } from '../componentes/Volver'
import { useJuego, useTextos } from '../estado/juego'
import { type Mecanica, type Tema, esMecanica, esTema } from '../lib/dominio'
import { type Partida as Tablero, generarPartida } from '../lib/partida'
import { anotarPartida } from '../lib/progreso'
import { Encajar } from '../mecanicas/Encajar'
import { rutas } from '../rutas'

/**
 * La pantalla de juego. Las mecánicas viven en `src/mecanicas/`; esto decide
 * cuál toca, le da una partida y recoge cuando se acaba.
 */
export default function Partida() {
  const { mecanica, tema } = useParams()
  const textos = useTextos()

  if (!esMecanica(mecanica) || !esTema(tema)) return <Navigate to={rutas.inicio} replace />

  return (
    <main className="flex h-full flex-col bg-purple-50">
      <header className="flex shrink-0 items-center gap-4 p-4">
        <Volver a={rutas.temas(mecanica)} />
        <h1 className="text-2xl font-bold text-purple-700 sm:text-3xl">
          {textos.mecanicas[mecanica]} · {textos.temas[tema]}
        </h1>
      </header>

      {/* La `key` es lo que hace que cambiar de tema sin salir de la pantalla
          empiece un tablero limpio: el enrutador reutiliza el componente
          cuando solo cambian los parámetros de la URL. */}
      <Ronda key={`${mecanica}/${tema}`} mecanica={mecanica} tema={tema} />
    </main>
  )
}

/**
 * Cuánto se queda en pantalla el tablero recién terminado antes de repartir el
 * siguiente. Sin la pausa, la última pieza que el niño encaja desaparece en el
 * mismo gesto y parece que se ha roto algo. Lo que llena este hueco —la
 * celebración— es el ticket 10; hasta entonces es solo un respiro.
 */
const PAUSA = 900

/**
 * Una partida detrás de otra sobre la misma mecánica y el mismo tema. El juego
 * no tiene pantalla de fin: al terminar un tablero se reparte otro, que es lo
 * que hace un niño que quiere seguir.
 */
function Ronda({ mecanica, tema }: { mecanica: Mecanica; tema: Tema }) {
  const { guardado, actualizar } = useJuego()
  const [ronda, setRonda] = useState(0)
  const [partida, setPartida] = useState<Tablero>(() =>
    generarPartida(mecanica, tema, guardado.completadas[mecanica]),
  )
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Si el niño sale a mitad de la pausa, el temporizador no debe repartir un
  // tablero en una pantalla que ya no existe.
  useEffect(() => () => clearTimeout(espera.current), [])

  function alTerminar() {
    actualizar((estado) => anotarPartida(estado, mecanica))

    espera.current = setTimeout(() => {
      // El `+ 1` es la partida que se acaba de terminar: `guardado` es el de
      // este render y todavía no la lleva contada. Importa porque de ahí sale
      // el nivel, y con él cuántas piezas trae el tablero siguiente.
      setPartida(generarPartida(mecanica, tema, guardado.completadas[mecanica] + 1))
      setRonda((n) => n + 1)
    }, PAUSA)
  }

  return (
    <div className="min-h-0 grow">
      {/* Las otras dos mecánicas llegan en los tickets 07 y 08. Hasta entonces
          sus temas se abren y se ven, pero no reparten tablero. */}
      {mecanica === 'encajar' ? (
        <Encajar key={ronda} partida={partida} alTerminar={alTerminar} />
      ) : null}
    </div>
  )
}
