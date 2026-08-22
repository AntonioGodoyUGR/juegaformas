import { useParams } from 'react-router-dom'

/**
 * El tablero. Cada mecánica trae el suyo en los tickets 06, 07 y 08.
 */
export default function Partida() {
  const { mecanica, tema } = useParams()

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 bg-purple-50 p-8">
      <h1 className="text-4xl font-bold text-purple-700">
        {mecanica} · {tema}
      </h1>
    </main>
  )
}
