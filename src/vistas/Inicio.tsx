import { Link } from 'react-router-dom'
import { EsquinaDeAjustes } from '../componentes/Ajustes'
import { Escenario } from '../componentes/Escenario'
import { useTextos } from '../estado/juego'
import { PlanetaDeMecanica } from '../iconos/planetas'
import { MECANICAS } from '../lib/dominio'
import { Mascota } from '../piezas/mascota'
import { rutas } from '../rutas'

/**
 * Primer toque: la mecánica. Tres botones, nada más. No hay tutorial, ni
 * pantalla de carga, ni continuar-la-última-partida: cualquiera de las tres
 * cosas pondría un paso entre abrir el juego y jugar, y son dos toques en
 * total.
 *
 * Tampoco se enseña el progreso: enseñar cuánto falta solo sirve para que el
 * niño se compare consigo mismo. Lo único que se elige —cuántas piezas trae el
 * tablero— se elige dentro de cada mecánica, en su pantalla de temas, porque es
 * de cada mecánica y no del juego entero.
 *
 * Los tres planetas no van todos a la misma altura. Alineados serían una fila
 * de botones; desnivelados son sitios de un cielo, que es lo que son.
 */

/** Cuánto baja cada planeta respecto a la fila, en el orden de `MECANICAS`. */
const DESNIVEL = ['', 'mt-6 sm:mt-10', '']

export default function Inicio() {
  const textos = useTextos()

  return (
    <main className="relative flex h-full flex-col items-center justify-center gap-6 bg-cielo p-6">
      <Escenario banda="baja" cohete />
      <EsquinaDeAjustes />

      <h1 className="relative text-4xl font-bold text-white sm:text-5xl">{textos.nombre}</h1>

      {/* En fila y siempre en fila: la tablet se sostiene apaisada. Los tres
          planetas se reparten el ancho a partes iguales y dejan de crecer
          cuando ya son cómodos; nunca se apilan. */}
      <nav className="relative flex w-full items-start justify-center gap-4 sm:gap-10">
        {MECANICAS.map((mecanica, i) => (
          <Link
            key={mecanica}
            to={rutas.temas(mecanica)}
            className={`flex max-w-64 flex-1 basis-0 flex-col items-center gap-2 transition-transform active:scale-95 ${DESNIVEL[i]}`}
          >
            <PlanetaDeMecanica mecanica={mecanica} className="w-full" />
            <span className="text-xl font-bold text-white sm:text-2xl">
              {textos.mecanicas[mecanica]}
            </span>
          </Link>
        ))}
      </nav>

      {/* La mascota se apoya en el suelo del planeta, en la esquina de la que
          nadie tira: el pulgar izquierdo de quien sostiene la tablet queda por
          debajo, y los planetas por encima. */}
      <Mascota
        pose="reposo"
        className="pointer-events-none absolute bottom-2 left-3 w-28 sm:bottom-4 sm:left-6 sm:w-40"
      />
    </main>
  )
}
