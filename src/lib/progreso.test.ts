import { beforeEach, describe, expect, test } from 'vitest'
import { DIFICULTAD_INICIAL } from './dominio'
import {
  CLAVE,
  anotarPartida,
  elegirDificultad,
  elegirIdioma,
  guardar,
  leer,
  porDefecto,
  reiniciar,
} from './progreso'

beforeEach(() => localStorage.clear())

describe('leer', () => {
  test('sin nada guardado arranca de cero', () => {
    expect(leer()).toEqual(porDefecto())
  })

  test('un guardado válido se recupera entero', () => {
    const estado = { ...porDefecto(), idioma: 'en' as const, volumen: 0.2 }
    guardar(estado)
    expect(leer()).toEqual(estado)
  })

  test('basura en el almacén no impide jugar', () => {
    localStorage.setItem(CLAVE, 'esto no es json')
    expect(leer()).toEqual(porDefecto())
  })

  test('un guardado de otra forma se rellena campo a campo', () => {
    localStorage.setItem(CLAVE, JSON.stringify({ completadas: { encajar: 7 } }))
    const estado = leer()
    expect(estado.completadas.encajar).toBe(7)
    expect(estado.completadas.ordenar).toBe(0)
    expect(estado.idioma).toBe('es')
  })

  test('los contadores imposibles se ponen a cero', () => {
    localStorage.setItem(
      CLAVE,
      JSON.stringify({ completadas: { encajar: -3, emparejar: 'muchas', ordenar: 2.7 } }),
    )
    expect(leer().completadas).toEqual({ encajar: 0, emparejar: 0, ordenar: 2 })
  })

  test('un idioma que no existe cae al castellano', () => {
    localStorage.setItem(CLAVE, JSON.stringify({ idioma: 'klingon' }))
    expect(leer().idioma).toBe('es')
  })

  test('la dificultad elegida sobrevive a cerrar el juego', () => {
    guardar(elegirDificultad(porDefecto(), 'ordenar', 'dificil'))
    expect(leer().dificultad.ordenar).toBe('dificil')
  })

  test('una dificultad que no existe solo afecta a su mecánica', () => {
    localStorage.setItem(
      CLAVE,
      JSON.stringify({ dificultad: { encajar: 'imposible', emparejar: 'dificil' } }),
    )
    expect(leer().dificultad).toEqual({
      encajar: DIFICULTAD_INICIAL,
      emparejar: 'dificil',
      ordenar: DIFICULTAD_INICIAL,
    })
  })

  test('un volumen fuera de rango cae al de por defecto', () => {
    localStorage.setItem(CLAVE, JSON.stringify({ volumen: 42 }))
    expect(leer().volumen).toBe(porDefecto().volumen)
  })

  test('un almacén que lanza no tumba el juego', () => {
    const roto = {
      getItem() {
        throw new Error('almacenamiento bloqueado')
      },
    }
    expect(leer(roto)).toEqual(porDefecto())
  })
})

describe('guardar', () => {
  test('un almacén que lanza no tumba el juego', () => {
    const roto = {
      setItem() {
        throw new Error('cuota llena')
      },
    }
    expect(() => guardar(porDefecto(), roto)).not.toThrow()
  })
})

describe('anotar partida', () => {
  test('suma una sola partida a una sola mecánica', () => {
    const antes = porDefecto()
    const despues = anotarPartida(antes, 'emparejar')
    expect(despues.completadas).toEqual({ encajar: 0, emparejar: 1, ordenar: 0 })
  })

  test('no muta el estado anterior', () => {
    const antes = porDefecto()
    anotarPartida(antes, 'encajar')
    expect(antes.completadas.encajar).toBe(0)
  })
})

describe('reiniciar', () => {
  test('deja el juego como recién instalado', () => {
    guardar(anotarPartida(porDefecto(), 'ordenar'))
    expect(reiniciar()).toEqual(porDefecto())
    expect(leer()).toEqual(porDefecto())
  })
})

describe('elegir dificultad', () => {
  test('un juego recién instalado empieza por lo más fácil en las tres', () => {
    expect(porDefecto().dificultad).toEqual({
      encajar: DIFICULTAD_INICIAL,
      emparejar: DIFICULTAD_INICIAL,
      ordenar: DIFICULTAD_INICIAL,
    })
  })

  test('cambiarla en una mecánica no toca las otras dos', () => {
    const despues = elegirDificultad(porDefecto(), 'emparejar', 'dificil')
    expect(despues.dificultad).toEqual({
      encajar: DIFICULTAD_INICIAL,
      emparejar: 'dificil',
      ordenar: DIFICULTAD_INICIAL,
    })
  })

  test('no muta el estado anterior', () => {
    const antes = porDefecto()
    elegirDificultad(antes, 'encajar', 'dificil')
    expect(antes.dificultad.encajar).toBe(DIFICULTAD_INICIAL)
  })

  test('reiniciar la devuelve a la de fábrica', () => {
    guardar(elegirDificultad(porDefecto(), 'encajar', 'dificil'))
    expect(reiniciar().dificultad.encajar).toBe(DIFICULTAD_INICIAL)
  })
})

describe('elegir idioma', () => {
  test('la variante del dispositivo da igual', () => {
    expect(elegirIdioma(['es-419'])).toBe('es')
    expect(elegirIdioma(['EN-gb'])).toBe('en')
  })

  test('gana el primero de la lista que hablamos', () => {
    expect(elegirIdioma(['fr-FR', 'de', 'en-US', 'es-ES'])).toBe('en')
  })

  test('un dispositivo que no habla ninguno de los dos juega en castellano', () => {
    expect(elegirIdioma(['fr-FR', 'de'])).toBe('es')
    expect(elegirIdioma([])).toBe('es')
    expect(elegirIdioma()).toBe('es')
  })

  test('el idioma inicial solo se usa cuando no hay nada guardado', () => {
    expect(leer(localStorage, 'en').idioma).toBe('en')
    guardar({ ...porDefecto(), idioma: 'es' })
    expect(leer(localStorage, 'en').idioma).toBe('es')
  })
})
