import { Navigate, useParams } from 'react-router-dom'
import { useTextos } from '../estado/juego'
import { esMecanica } from '../lib/dominio'
import { rutas } from '../rutas'

/**
 * Segundo toque: el tema. Los siete están siempre disponibles; la fila
 * definitiva llega con el ticket 05.
 */
export default function Temas() {
  const { mecanica } = useParams()
  const textos = useTextos()

  // El slug de la URL hay que traducirlo, y para traducirlo hay que validarlo.
  // Una mecánica inventada devuelve al inicio, igual que una ruta que no
  // existe: nunca una pantalla de error.
  if (!esMecanica(mecanica)) return <Navigate to={rutas.inicio} replace />

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 bg-purple-50 p-8">
      <h1 className="text-4xl font-bold text-purple-700">{textos.mecanicas[mecanica]}</h1>
    </main>
  )
}
