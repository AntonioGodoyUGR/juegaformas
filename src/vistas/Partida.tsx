import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CelebracionBreve, CelebracionDeNivel } from '../componentes/Celebracion'
import { Escenario } from '../componentes/Escenario'
import { Volver } from '../componentes/Volver'
import { useJuego, useTextos } from '../estado/juego'
import { type Dificultad, type Mecanica, type Tema, esMecanica, esTema } from '../lib/dominio'
import { juegaBocaAbajo } from '../lib/emparejar'
import { completaNivel } from '../lib/niveles'
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
  const { guardado } = useJuego()

  if (!esMecanica(mecanica) || !esTema(tema)) return <Navigate to={rutas.inicio} replace />

  const dificultad = guardado.dificultad[mecanica]

  return (
    <main className="relative flex h-full flex-col bg-cielo">
      <Escenario banda="alta" />

      <header className="relative flex shrink-0 items-center gap-4 p-4">
        <Volver a={rutas.temas(mecanica)} />
        {/* El separador va en el mismo texto y no en un span teñido: partir el
            título en trozos parte también el nombre accesible, y el encabezado
            dejaría de leerse «Encajar · Espacio» de corrido. */}
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          {textos.mecanicas[mecanica]} · {textos.temas[tema]}
        </h1>
      </header>

      {/* La `key` es lo que hace que cambiar de tema sin salir de la pantalla
          empiece un tablero limpio: el enrutador reutiliza el componente
          cuando solo cambian los parámetros de la URL.

          La dificultad va dentro de la `key` por lo mismo: si un adulto la
          cambia mientras el niño juega —se puede, volviendo atrás—, lo que
          tiene que pasar es que se reparta un tablero del tamaño nuevo, no que
          el de en medio se quede a medias. */}
      <Ronda
        key={`${mecanica}/${tema}/${dificultad}`}
        mecanica={mecanica}
        tema={tema}
        dificultad={dificultad}
      />
    </main>
  )
}

/**
 * Cuánto se queda en pantalla el tablero recién terminado, con la celebración
 * breve encima, antes de que pase lo siguiente. Sin esta pausa la última pieza
 * que el niño encaja desaparece en el mismo gesto de encajarla y parece que se
 * ha roto algo.
 *
 * Poco más de un segundo: lo justo para que se vea que ha salido bien y no
 * tanto como para que el niño tenga que esperar a que el juego termine de
 * felicitarle.
 */
const CELEBRACION = 1200

/**
 * Qué se ve encima del tablero. `partida` es una capa que se va sola; `nivel`
 * es una pantalla entera que espera un toque. Son un estado y no dos banderas
 * porque nunca se solapan: la grande sustituye a la breve, no se suma.
 */
type Celebrando = 'ninguna' | 'partida' | 'nivel'

/**
 * Una partida detrás de otra sobre la misma mecánica y el mismo tema. El juego
 * no tiene pantalla de fin: al terminar un tablero se reparte otro, que es lo
 * que hace un niño que quiere seguir.
 */
function Ronda({
  mecanica,
  tema,
  dificultad,
}: {
  mecanica: Mecanica
  tema: Tema
  dificultad: Dificultad
}) {
  const { guardado, actualizar } = useJuego()

  // Cuántas partidas lleva hechas de esta mecánica. Se lee del progreso al
  // entrar y a partir de ahí lo lleva la pantalla, porque es el número del que
  // cuelga el ritmo: cuándo toca celebración de nivel, si `emparejar` reparte
  // boca abajo y con qué criterio ordena `ordenar`. Con una sola cuenta no hay
  // forma de que una de esas decisiones se quede una partida por detrás de las
  // otras. Cuántas piezas trae el tablero ya no cuelga de aquí: eso lo dice la
  // dificultad elegida, y no cambia mientras se juega.
  const [completadas, setCompletadas] = useState(guardado.completadas[mecanica])
  const [partida, setPartida] = useState<Tablero>(() => generarPartida(mecanica, tema, dificultad))
  const [celebrando, setCelebrando] = useState<Celebrando>('ninguna')
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Si el niño sale a mitad de la pausa, el temporizador no debe repartir un
  // tablero en una pantalla que ya no existe.
  useEffect(() => () => clearTimeout(espera.current), [])

  function alTerminar() {
    // El progreso se anota al terminar el tablero y no al salir de la
    // celebración: si el niño cierra la aplicación mirando las estrellas, la
    // partida que acaba de resolver ya está contada.
    actualizar((estado) => anotarPartida(estado, mecanica))
    setCelebrando('partida')

    // Las dos celebraciones empiezan igual —la capa breve encima del tablero
    // resuelto— y se separan aquí: si esta partida cerraba el nivel, lo que
    // viene después no es otro tablero, sino la pantalla que lo dice.
    espera.current = setTimeout(() => {
      if (completaNivel(mecanica, completadas)) setCelebrando('nivel')
      else siguiente()
    }, CELEBRACION)
  }

  function siguiente() {
    const hechas = completadas + 1
    setCelebrando('ninguna')
    setCompletadas(hechas)
    setPartida(generarPartida(mecanica, tema, dificultad))
  }

  // La celebración de nivel es una pantalla propia: mientras está, no hay
  // tablero debajo. La breve sí lo tiene, porque lo que celebra está ahí.
  if (celebrando === 'nivel') {
    return (
      <div className="relative min-h-0 grow">
        <CelebracionDeNivel alSeguir={siguiente} />
      </div>
    )
  }

  // La `key` es la partida contada: al cambiar, la mecánica se monta de cero y
  // no queda nada del tablero anterior.
  return (
    <div className="relative min-h-0 grow">
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

      {celebrando === 'partida' && <CelebracionBreve />}
    </div>
  )
}
