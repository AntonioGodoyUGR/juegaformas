import type { ComponentType } from 'react'
import { useTextos } from '../estado/juego'
import { Lienzo } from './lienzo'
import * as animales from './dibujos/animales'
import * as comida from './dibujos/comida'
import * as deportes from './dibujos/deportes'
import * as espacio from './dibujos/espacio'
import * as mar from './dibujos/mar'
import * as naturaleza from './dibujos/naturaleza'
import * as vehiculos from './dibujos/vehiculos'

/**
 * El registro: identificador de pieza a dibujo. Las claves tienen que existir
 * en el catálogo de `src/lib/piezas.ts`, y hay un test que lo comprueba.
 */
export const DIBUJOS: Readonly<Record<string, ComponentType>> = {
  'espacio/cohete': espacio.Cohete,
  'espacio/planeta': espacio.Planeta,
  'espacio/estrella': espacio.Estrella,
  'espacio/luna': espacio.Luna,
  'espacio/satelite': espacio.Satelite,
  'espacio/astronauta': espacio.Astronauta,

  'animales/leon': animales.Leon,
  'animales/elefante': animales.Elefante,
  'animales/jirafa': animales.Jirafa,
  'animales/oso': animales.Oso,
  'animales/conejo': animales.Conejo,
  'animales/zorro': animales.Zorro,

  'mar/pez': mar.Pez,
  'mar/pulpo': mar.Pulpo,
  'mar/ballena': mar.Ballena,
  'mar/cangrejo': mar.Cangrejo,
  'mar/medusa': mar.Medusa,
  'mar/caracola': mar.Caracola,

  'naturaleza/arbol': naturaleza.Arbol,
  'naturaleza/flor': naturaleza.Flor,
  'naturaleza/nube': naturaleza.Nube,
  'naturaleza/hoja': naturaleza.Hoja,
  'naturaleza/montana': naturaleza.Montana,
  'naturaleza/seta': naturaleza.Seta,

  'comida/manzana': comida.Manzana,
  'comida/platano': comida.Platano,
  'comida/zanahoria': comida.Zanahoria,
  'comida/pan': comida.Pan,
  'comida/queso': comida.Queso,
  'comida/helado': comida.Helado,

  'deportes/balon': deportes.Balon,
  'deportes/canasta': deportes.Canasta,
  'deportes/raqueta': deportes.Raqueta,
  'deportes/medalla': deportes.Medalla,
  'deportes/pesa': deportes.Pesa,
  'deportes/porteria': deportes.Porteria,

  'vehiculos/coche': vehiculos.Coche,
  'vehiculos/autobus': vehiculos.Autobus,
  'vehiculos/tren': vehiculos.Tren,
  'vehiculos/avion': vehiculos.Avion,
  'vehiculos/camion': vehiculos.Camion,
  'vehiculos/bicicleta': vehiculos.Bicicleta,
}

export function hayDibujo(id: string): boolean {
  return id in DIBUJOS
}

/**
 * Pinta una pieza del catálogo.
 *
 * El nombre accesible sale del catálogo de textos y cambia con el idioma. Sin
 * él, un dibujo sin palabra al lado no se puede nombrar en voz alta, y aquí la
 * pieza *es* el contenido: no hay ningún otro sitio donde ponga «cohete».
 *
 * `decorativa` es para cuando la misma pieza aparece dos veces en pantalla —el
 * hueco y la ficha que encaja en él—: repetir el nombre no informa, estorba.
 */
export function Pieza({
  id,
  className,
  decorativa = false,
}: {
  id: string
  className?: string
  decorativa?: boolean
}) {
  const textos = useTextos()
  const Dibujo = DIBUJOS[id]
  if (!Dibujo) return null

  return (
    <Lienzo nombre={decorativa ? undefined : textos.piezas[id]} className={className}>
      <Dibujo />
    </Lienzo>
  )
}
