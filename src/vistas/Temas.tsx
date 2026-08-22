import { useParams } from 'react-router-dom'

/**
 * Segundo toque: el tema. Los siete están siempre disponibles; la fila
 * definitiva llega con el ticket 05.
 */
export default function Temas() {
  const { mecanica } = useParams()

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 bg-purple-50 p-8">
      <h1 className="text-4xl font-bold text-purple-700">{mecanica}</h1>
    </main>
  )
}
