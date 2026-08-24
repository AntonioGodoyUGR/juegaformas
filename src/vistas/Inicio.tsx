import { Link } from 'react-router-dom'
import { EsquinaDeAjustes } from '../componentes/Ajustes'
import { useTextos } from '../estado/juego'
import { IconoDeMecanica } from '../iconos/mecanicas'
import { MECANICAS } from '../lib/dominio'
import { rutas } from '../rutas'

/**
 * Primer toque: la mecánica. Tres botones, nada más. No hay tutorial, ni
 * pantalla de carga, ni continuar-la-última-partida: cualquiera de las tres
 * cosas pondría un paso entre abrir el juego y jugar, y son dos toques en
 * total.
 *
 * Tampoco se enseña el progreso. El nivel se sube jugando y no se elige nunca,
 * así que enseñar cuánto falta solo sirve para que el niño se compare consigo
 * mismo.
 */
export default function Inicio() {
  const textos = useTextos()

  return (
    <main className="relative flex h-full flex-col items-center justify-center gap-8 bg-purple-50 p-6">
      <EsquinaDeAjustes />

      <h1 className="text-3xl font-bold text-purple-700 sm:text-4xl">{textos.nombre}</h1>

      {/* En fila y siempre en fila: la tablet se sostiene apaisada. Las tres
          tarjetas se reparten el ancho a partes iguales y dejan de crecer
          cuando ya son cómodas; nunca se apilan. */}
      <nav className="flex w-full items-stretch justify-center gap-4 sm:gap-8">
        {MECANICAS.map((mecanica) => (
          <Link
            key={mecanica}
            to={rutas.temas(mecanica)}
            className="flex max-w-72 flex-1 basis-0 flex-col items-center gap-3 rounded-3xl bg-white p-4 shadow-lg transition-transform active:scale-95"
          >
            <IconoDeMecanica mecanica={mecanica} className="w-full" />
            <span className="text-xl font-bold text-purple-700 sm:text-2xl">
              {textos.mecanicas[mecanica]}
            </span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
