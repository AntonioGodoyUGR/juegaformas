import { Navigate, useParams } from 'react-router-dom'
import { Volver } from '../componentes/Volver'
import { useTextos } from '../estado/juego'
import { esMecanica, esTema } from '../lib/dominio'
import { rutas } from '../rutas'

/**
 * El tablero. Cada mecánica trae el suyo en los tickets 06, 07 y 08; lo que ya
 * está aquí es la salida, para que se pueda cambiar de tema sin cerrar el
 * juego.
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
    </main>
  )
}
