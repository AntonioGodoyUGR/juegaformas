import { describe, expect, test } from 'vitest'
import { type Diana, type Recuadro, TOLERANCIA, huecoMasCercano } from './cerca'

/** Un recuadro de 100 con la esquina donde se le diga. */
const caja = (x: number, y: number, lado = 100): Recuadro => ({ x, y, ancho: lado, alto: lado })

describe('a qué hueco va la pieza', () => {
  // Dos huecos de 100 bien separados, para que entre ellos quede una zona de
  // nadie: con la tolerancia al 60% de 100, hay sitio para soltar y fallar.
  const huecos: readonly Diana[] = [
    { id: 'izquierda', recuadro: caja(0, 0) },
    { id: 'derecha', recuadro: caja(500, 0) },
  ]

  test('encima del hueco', () => {
    expect(huecoMasCercano(caja(0, 0), huecos)).toBe('izquierda')
  })

  test('solapando un poco ya vale', () => {
    expect(huecoMasCercano(caja(80, 20), huecos)).toBe('izquierda')
  })

  test('cerca sin tocar también vale', () => {
    // 40 de hueco entre los dos recuadros, con 60 de tolerancia sobre un
    // hueco de 100. Un niño que se queda corto encaja igual.
    expect(huecoMasCercano(caja(140, 0), huecos)).toBe('izquierda')
  })

  test('lejos de todo no vale', () => {
    // Soltada en tierra de nadie: 100 de separación a cada lado, muy por
    // encima de los 60 que se perdonan. Sin este caso la pieza siempre
    // encontraría sitio y la mecánica se resolvería sola.
    expect(huecoMasCercano(caja(200, 0), huecos)).toBe(null)
  })

  test('la tolerancia se mide en tamaños de hueco, no en píxeles', () => {
    // La misma separación de 100, contra un hueco del doble de tamaño. En
    // casillas de 200 son media casilla y se perdona; en casillas de 100 es
    // una casilla entera y no. La puntería de un dedo se mide así, no en
    // píxeles, para que el juego se comporte igual en una tablet y en una
    // ventana pequeña.
    const grandes: readonly Diana[] = [{ id: 'grande', recuadro: caja(0, 0, 200) }]

    expect(huecoMasCercano(caja(300, 0, 200), grandes)).toBe('grande')
    expect(huecoMasCercano(caja(200, 0), huecos)).toBe(null)
  })

  test('entre dos huecos gana el de centro más cercano', () => {
    const pegados: readonly Diana[] = [
      { id: 'izquierda', recuadro: caja(0, 0) },
      { id: 'derecha', recuadro: caja(100, 0) },
    ]

    expect(huecoMasCercano(caja(60, 0), pegados)).toBe('derecha')
    expect(huecoMasCercano(caja(40, 0), pegados)).toBe('izquierda')
  })

  test('sin huecos no hay hueco', () => {
    expect(huecoMasCercano(caja(0, 0), [])).toBe(null)
  })

  test('la tolerancia es generosa de verdad', () => {
    // Si alguien la baja a algo con lo que un adulto tiene que apuntar, este
    // test es el que se queja.
    expect(TOLERANCIA).toBeGreaterThanOrEqual(0.5)
  })
})
