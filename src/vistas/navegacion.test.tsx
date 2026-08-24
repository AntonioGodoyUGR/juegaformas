import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import App from '../App'
import { ProveedorDeJuego } from '../estado/juego'
import { MECANICAS, TEMAS } from '../lib/dominio'
import { rutas } from '../rutas'
import { es } from '../textos/es'

// Las dos pantallas de navegación se prueban por lo que hace un niño con el
// dedo, no por lo que renderizan: tocar y llegar.

function montar(ruta: string = rutas.inicio) {
  return render(
    <ProveedorDeJuego preferencias={['es']}>
      <MemoryRouter initialEntries={[ruta]}>
        <App />
      </MemoryRouter>
    </ProveedorDeJuego>,
  )
}

const tocar = (nombre: string) => fireEvent.click(screen.getByRole('link', { name: nombre }))

test('desde el arranque en frío se está jugando en dos toques', () => {
  montar()

  tocar('Encajar')
  tocar('Espacio')

  expect(screen.getByRole('heading', { name: 'Encajar · Espacio' })).toBeInTheDocument()
})

test.each(MECANICAS)('%s lleva a su propia elección de tema', (mecanica) => {
  montar()

  tocar(es.mecanicas[mecanica])

  expect(screen.getByRole('heading', { name: es.mecanicas[mecanica] })).toBeInTheDocument()
})

test.each(TEMAS)('%s se puede jugar sin haber jugado nada antes', (tema) => {
  // Ningún tema lleva candado: no hay nada que desbloquear, así que los siete
  // se abren con el progreso recién estrenado.
  montar(rutas.temas('encajar'))

  tocar(es.temas[tema])

  expect(screen.getByRole('heading', { name: `Encajar · ${es.temas[tema]}` })).toBeInTheDocument()
})

test('los siete temas están y no hay nada más que tocar', () => {
  montar(rutas.temas('ordenar'))

  // Los siete, más la salida. Si aparece un octavo tema o desaparece uno, es
  // que la pantalla ha dejado de seguir al dominio.
  expect(screen.getAllByRole('link')).toHaveLength(TEMAS.length + 1)
  expect(screen.getByRole('link', { name: 'Volver' })).toBeInTheDocument()
})

test('un tema se anuncia por su nombre, no por la pieza que lo enseña', () => {
  montar(rutas.temas('encajar'))

  expect(screen.getByRole('link', { name: 'Espacio' })).toBeInTheDocument()
  expect(screen.queryByRole('img', { name: 'Cohete' })).not.toBeInTheDocument()
})

test('los iconos de mecánica no se anuncian aparte del botón', () => {
  montar()

  expect(screen.getByRole('link', { name: 'Emparejar' })).toBeInTheDocument()
  expect(screen.queryAllByRole('img')).toHaveLength(0)
})

test('volver deshace un toque, no la sesión entera', () => {
  montar(rutas.partida('emparejar', 'mar'))

  tocar('Volver')
  expect(screen.getByRole('heading', { name: 'Emparejar' })).toBeInTheDocument()

  tocar('Volver')
  expect(screen.getByRole('heading', { name: 'JuegaFormas' })).toBeInTheDocument()
})

test('el inicio no enseña progreso ni deja elegir nivel', () => {
  montar()

  // Tres mecánicas y nada más: ni niveles, ni continuar, ni ajustes a la vista.
  expect(screen.getAllByRole('link')).toHaveLength(MECANICAS.length)
})
