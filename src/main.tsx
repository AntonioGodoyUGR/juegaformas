import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// `HashRouter` y no `BrowserRouter`: sin servidor que reescriba las rutas, un
// recargar en GitHub Pages daría 404, y dentro de Capacitor la aplicación se
// sirve por `file://`, donde no hay rutas que valgan.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
