import { TEMAS, type Pieza, type Tema } from './dominio'

/**
 * El catálogo: qué piezas existen y de qué tema son. Solo datos; los dibujos
 * llegan con el ticket 03.
 *
 * Los assets no llevan atributos de dificultad a propósito
 * (`docs/adr/0001-progresion-por-numero-de-piezas.md`): la única palanca de
 * progresión es cuántas piezas tiene el tablero, así que basta con tema y
 * nombre.
 *
 * Cada tema tiene el mismo número de piezas para que ninguno se quede corto de
 * variedad, y las fronteras entre temas no se solapan. Dos que costaron:
 *
 * - El barco no está en `vehiculos`. `CONTEXT.md` define `mar` como todo lo que
 *   vive **o flota** en el agua, y esa frase se escribió justamente para que el
 *   barco cayera ahí. Aquí manda el glosario.
 * - La bicicleta está en `vehiculos` y no en `deportes`: `deportes` son los
 *   objetos con los que se juega, no las cosas sobre las que uno se sube.
 */
const CATALOGO: Readonly<Record<Tema, readonly string[]>> = {
  espacio: ['cohete', 'planeta', 'estrella', 'luna', 'satelite', 'astronauta'],
  animales: ['leon', 'elefante', 'jirafa', 'oso', 'conejo', 'zorro'],
  mar: ['pez', 'pulpo', 'ballena', 'cangrejo', 'medusa', 'caracola'],
  naturaleza: ['arbol', 'flor', 'nube', 'hoja', 'montana', 'seta'],
  comida: ['manzana', 'platano', 'zanahoria', 'pan', 'queso', 'helado'],
  deportes: ['balon', 'canasta', 'raqueta', 'medalla', 'pesa', 'porteria'],
  vehiculos: ['coche', 'autobus', 'tren', 'avion', 'camion', 'bicicleta'],
}

const POR_TEMA: Readonly<Record<Tema, readonly Pieza[]>> = TEMAS.reduce(
  (porTema, tema) => {
    porTema[tema] = CATALOGO[tema].map((nombre) => ({ id: `${tema}/${nombre}`, tema }))
    return porTema
  },
  {} as Record<Tema, readonly Pieza[]>,
)

export function piezasDe(tema: Tema): readonly Pieza[] {
  return POR_TEMA[tema]
}

/**
 * La pieza con la que se anuncia un tema en la pantalla de elección. Es siempre
 * la misma, a propósito: un niño que no lee elige por el dibujo, y un tema que
 * cambia de cara en cada visita deja de ser reconocible.
 */
export function muestraDe(tema: Tema): Pieza {
  return POR_TEMA[tema][0]
}

export function todasLasPiezas(): readonly Pieza[] {
  return Object.values(POR_TEMA).flat()
}
