import { Link, Navigate, useParams } from 'react-router-dom'
import { Volver } from '../componentes/Volver'
import { useTextos } from '../estado/juego'
import { TEMAS, esMecanica } from '../lib/dominio'
import { muestraDe } from '../lib/piezas'
import { Pieza } from '../piezas'
import { rutas } from '../rutas'

/**
 * Segundo toque: el tema. Los siete están siempre, todos iguales y ninguno con
 * candado: el tema es piel, no dificultad, y lo que se desbloquea jugando es el
 * nivel, que no se elige ni se enseña.
 *
 * Cada tema se anuncia con una pieza suya, que es lo que mira quien no lee. El
 * nombre va debajo para el adulto y para el lector de pantalla; el dibujo va
 * como decorativo porque el enlace ya se llama «Espacio», y anunciarlo como
 * «Cohete, Espacio» solo alarga lo mismo.
 */
export default function Temas() {
  const { mecanica } = useParams()
  const textos = useTextos()

  // La URL la escribe cualquiera. Una mecánica inventada devuelve al inicio,
  // igual que una ruta que no existe: nunca una pantalla de error.
  if (!esMecanica(mecanica)) return <Navigate to={rutas.inicio} replace />

  return (
    <main className="flex h-full flex-col bg-purple-50">
      <header className="flex shrink-0 items-center gap-4 p-4">
        <Volver a={rutas.inicio} />
        <h1 className="text-2xl font-bold text-purple-700 sm:text-3xl">
          {textos.mecanicas[mecanica]}
        </h1>
      </header>

      {/* El ancho está topado para que quepan exactamente cuatro por fila: siete
          en una sola fila salen del tamaño de un dedo de cinco años, y siete
          repartidos 4+3 llenan la pantalla apaisada sin hacer scroll. */}
      <nav className="mx-auto flex w-full max-w-[41rem] flex-1 flex-wrap content-center items-center justify-center gap-4 p-4 pb-8 md:max-w-[54rem]">
        {TEMAS.map((tema) => (
          <Link
            key={tema}
            to={rutas.partida(mecanica, tema)}
            className="flex w-36 flex-col items-center gap-1 rounded-3xl bg-white p-3 shadow-lg transition-transform active:scale-95 md:w-48"
          >
            <Pieza id={muestraDe(tema).id} className="w-full" decorativa />
            <span className="text-lg font-bold text-purple-700">
              {textos.temas[tema]}
            </span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
