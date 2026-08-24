import { expect, test } from 'vitest'
import { MECANICAS, TEMAS } from '../lib/dominio'
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
