import { Navigate, useParams } from 'react-router-dom'
import { useTextos } from '../estado/juego'
import { esMecanica, esTema } from '../lib/dominio'
import { rutas } from '../rutas'

/**
 * El tablero. Cada mecánica trae el suyo en los tickets 06, 07 y 08.
 */
export default function Partida() {
  const { mecanica, tema } = useParams()
  const textos = useTextos()

  if (!esMecanica(mecanica) || !esTema(tema)) return <Navigate to={rutas.inicio} replace />

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 bg-purple-50 p-8">
      <h1 className="text-4xl font-bold text-purple-700">
        {textos.mecanicas[mecanica]} · {textos.temas[tema]}
      </h1>
    </main>
  )
}
