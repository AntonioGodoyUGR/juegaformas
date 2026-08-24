import { Navigate, Route, Routes } from 'react-router-dom'
import Ajustes from './vistas/Ajustes'
import Inicio from './vistas/Inicio'
import Partida from './vistas/Partida'
import Temas from './vistas/Temas'

/**
 * Tres pasos: elegir mecánica, elegir tema, jugar. El nivel no aparece en la
 * URL porque el niño no lo elige: siempre se juega el más alto desbloqueado.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      {/* Antes de `/:mecanica` porque si no sería una mecánica llamada
          «ajustes». La ruta existe, pero al juego no se entra por ella: se
          llega manteniendo pulsada la esquina del inicio. */}
      <Route path="/ajustes" element={<Ajustes />} />
      <Route path="/:mecanica" element={<Temas />} />
      <Route path="/:mecanica/:tema" element={<Partida />} />
      {/* Una URL rota devuelve al inicio, nunca a una pantalla de error. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
