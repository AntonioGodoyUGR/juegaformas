import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Volver } from '../componentes/Volver'
import { useJuego, useTextos } from '../estado/juego'
import { type Mecanica, type Tema, esMecanica, esTema } from '../lib/dominio'
import { juegaBocaAbajo } from '../lib/emparejar'
import { criterioDe } from '../lib/ordenar'
import { type Partida as Tablero, generarPartida } from '../lib/partida'
import { anotarPartida } from '../lib/progreso'
import { Emparejar } from '../mecanicas/Emparejar'
import { Encajar } from '../mecanicas/Encajar'
import { Ordenar } from '../mecanicas/Ordenar'
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

  // Cuántas partidas lleva hechas de esta mecánica. Se lee del progreso al
  // entrar y a partir de ahí lo lleva la pantalla, porque es el número del que
  // cuelga todo lo demás: el nivel, cuántas piezas trae el tablero, si
  // `emparejar` reparte boca abajo y con qué criterio ordena `ordenar`. Con una
  // sola cuenta no hay forma de que una de esas decisiones se quede una partida
  // por detrás de las otras.
  const [completadas, setCompletadas] = useState(guardado.completadas[mecanica])
  const [partida, setPartida] = useState<Tablero>(() => generarPartida(mecanica, tema, completadas))
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Si el niño sale a mitad de la pausa, el temporizador no debe repartir un
  // tablero en una pantalla que ya no existe.
  useEffect(() => () => clearTimeout(espera.current), [])

  function alTerminar() {
    actualizar((estado) => anotarPartida(estado, mecanica))

    espera.current = setTimeout(() => {
      const siguiente = completadas + 1
      setCompletadas(siguiente)
      setPartida(generarPartida(mecanica, tema, siguiente))
    }, PAUSA)
  }

  // La `key` es la partida contada: al cambiar, la mecánica se monta de cero y
  // no queda nada del tablero anterior.
  return (
    <div className="min-h-0 grow">
      {mecanica === 'encajar' ? (
        <Encajar key={completadas} partida={partida} alTerminar={alTerminar} />
      ) : mecanica === 'emparejar' ? (
        <Emparejar
          key={completadas}
          partida={partida}
          bocaAbajo={juegaBocaAbajo(completadas)}
          alTerminar={alTerminar}
        />
      ) : (
        <Ordenar
          key={completadas}
          partida={partida}
          criterio={criterioDe(completadas)}
          alTerminar={alTerminar}
        />
      )}
    </div>
  )
}
