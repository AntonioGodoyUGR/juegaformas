import { expect, test } from 'vitest'
import { MECANICAS, TEMAS } from '../lib/dominio'
import { CRITERIOS } from '../lib/ordenar'
import { todasLasPiezas } from '../lib/piezas'
import { IDIOMAS } from '../lib/progreso'
import { textosDe } from './index'

// Un texto que falta no rompe nada: deja un hueco en pantalla o una pieza muda,
// y solo se ve en el idioma que nadie mira. Por eso se comprueban los dos.

const CATALOGOS = IDIOMAS.map((idioma) => [idioma, textosDe(idioma)] as const)

test.each(CATALOGOS)('%s nombra las tres mecánicas y los siete temas', (_idioma, textos) => {
  for (const mecanica of MECANICAS) expect(textos.mecanicas[mecanica]).toBeTruthy()
  for (const tema of TEMAS) expect(textos.temas[tema]).toBeTruthy()
  expect(textos.volver).toBeTruthy()
  expect(textos.cartaTapada).toBeTruthy()
})

test.each(CATALOGOS)('%s dice en su idioma lo que pasa al arrastrar', (_idioma, textos) => {
  // Es lo único que un lector de pantalla lee mientras se juega. Si falta una
  // frase, `@dnd-kit` pone la suya en inglés y nadie lo ve mirando la pantalla.
  for (const [clave, frase] of Object.entries(textos.arrastre)) {
    expect(frase, `falta ${clave}`).toBeTruthy()
  }
})

test.each(CATALOGOS)('%s cuenta una secuencia con la pieza y el número dentro', (_idioma, textos) => {
  // Las frases de `ordenar` son funciones, así que no basta con que existan:
  // tienen que usar lo que se les pasa. Una que se dejara fuera el número
  // llamaría igual a los tres eslabones de la secuencia.
  for (const criterio of CRITERIOS) expect(textos.orden.instrucciones[criterio]).toBeTruthy()

  expect(textos.orden.tamano('Cohete', 2, 3)).toContain('Cohete')
  expect(textos.orden.tamano('Cohete', 2, 3)).toContain('2')
  expect(textos.orden.tamano('Cohete', 2, 3)).not.toBe(textos.orden.tamano('Cohete', 3, 3))
  expect(textos.orden.cantidad('Cohete', 2)).toContain('Cohete')
  expect(textos.orden.cantidad('Cohete', 2)).not.toBe(textos.orden.cantidad('Cohete', 3))
  expect(textos.orden.sitio(1, 3)).not.toBe(textos.orden.sitio(2, 3))
})

test.each(CATALOGOS)('%s nombra las cuarenta y dos piezas', (_idioma, textos) => {
  for (const pieza of todasLasPiezas()) {
    expect(textos.piezas[pieza.id], `falta el nombre de ${pieza.id}`).toBeTruthy()
  }
})

test.each(CATALOGOS)('%s no nombra piezas que no existen', (_idioma, textos) => {
  const catalogo = new Set(todasLasPiezas().map((pieza) => pieza.id))
  for (const id of Object.keys(textos.piezas)) {
    expect(catalogo.has(id), `${id} no existe en el catálogo`).toBe(true)
  }
})
