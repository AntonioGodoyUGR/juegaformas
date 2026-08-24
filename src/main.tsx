import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { ProveedorDeAudio } from './estado/audio.tsx'
import { ProveedorDeJuego } from './estado/juego.tsx'
import './index.css'

// `HashRouter` y no `BrowserRouter`: sin servidor que reescriba las rutas, un
// recargar en GitHub Pages daría 404, y dentro de Capacitor la aplicación se
// sirve por `file://`, donde no hay rutas que valgan.
//
// El proveedor va por fuera del router: el idioma y el progreso no dependen de
// en qué pantalla esté el niño, y navegar no puede reiniciarlos.
//
// El de audio va dentro del de juego porque lee el volumen de ahí, y fuera del
// router por lo mismo: la música es de la sesión, no de la pantalla, y cambiar
// de tablero no puede cortarla.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProveedorDeJuego>
      <ProveedorDeAudio>
        <HashRouter>
          <App />
        </HashRouter>
      </ProveedorDeAudio>
    </ProveedorDeJuego>
  </StrictMode>,
)
