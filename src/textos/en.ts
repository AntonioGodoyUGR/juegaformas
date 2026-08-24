import { type Textos } from './index'

/**
 * Inglés. Las claves son las mismas que en castellano, siempre: hay un test que
 * compara los dos catálogos clave a clave, porque una pieza sin nombre en un
 * idioma se queda muda justo en el idioma que no probamos a mano.
 *
 * Palabras de niño de cinco años, no de diccionario: `bike` y no `bicycle`,
 * `hoop` y no `basketball hoop`.
 */
export const en: Textos = {
  nombre: 'JuegaFormas',
  volver: 'Back',

  mecanicas: {
    encajar: 'Fit',
    emparejar: 'Match',
    ordenar: 'Sort',
  },

  temas: {
    espacio: 'Space',
    animales: 'Animals',
    mar: 'Sea',
    naturaleza: 'Nature',
    comida: 'Food',
    deportes: 'Sports',
    vehiculos: 'Vehicles',
  },

  dificultad: {
    titulo: 'Difficulty',
    nombres: {
      facil: 'Easy',
      media: 'Normal',
      dificil: 'Hard',
    },
  },

  piezas: {
    'espacio/cohete': 'Rocket',
    'espacio/planeta': 'Planet',
    'espacio/estrella': 'Star',
    'espacio/luna': 'Moon',
    'espacio/satelite': 'Satellite',
    'espacio/astronauta': 'Astronaut',

    'animales/leon': 'Lion',
    'animales/elefante': 'Elephant',
    'animales/jirafa': 'Giraffe',
    'animales/oso': 'Bear',
    'animales/conejo': 'Rabbit',
    'animales/zorro': 'Fox',

    'mar/pez': 'Fish',
    'mar/pulpo': 'Octopus',
    'mar/ballena': 'Whale',
    'mar/cangrejo': 'Crab',
    'mar/medusa': 'Jellyfish',
    'mar/caracola': 'Seashell',

    'naturaleza/arbol': 'Tree',
    'naturaleza/flor': 'Flower',
    'naturaleza/nube': 'Cloud',
    'naturaleza/hoja': 'Leaf',
    'naturaleza/montana': 'Mountain',
    'naturaleza/seta': 'Mushroom',

    'comida/manzana': 'Apple',
    'comida/platano': 'Banana',
    'comida/zanahoria': 'Carrot',
    'comida/pan': 'Bread',
    'comida/queso': 'Cheese',
    'comida/helado': 'Ice cream',

    'deportes/balon': 'Ball',
    'deportes/canasta': 'Hoop',
    'deportes/raqueta': 'Racket',
    'deportes/medalla': 'Medal',
    'deportes/pesa': 'Dumbbell',
    'deportes/porteria': 'Goal',

    'vehiculos/coche': 'Car',
    'vehiculos/autobus': 'Bus',
    'vehiculos/tren': 'Train',
    'vehiculos/avion': 'Plane',
    'vehiculos/camion': 'Truck',
    'vehiculos/bicicleta': 'Bike',
  },

  arrastre: {
    instrucciones:
      'Drag each piece to its hole. With a keyboard: space to pick it up, arrow keys to move it and space again to drop it.',
    cogida: 'Piece picked up.',
    sobreHueco: 'Over a hole.',
    fueraDeHueco: 'Away from the holes.',
    encajada: 'Piece fitted.',
    devuelta: 'The piece goes back.',
  },

  cartaTapada: 'Card to turn over',

  orden: {
    instrucciones: {
      tamano:
        'Place the pieces from smallest to biggest. With a keyboard: space to pick one up, arrow keys to move it and space again to drop it.',
      cantidad:
        'Place the pieces from fewest to most. With a keyboard: space to pick one up, arrow keys to move it and space again to drop it.',
    },
    tamano: (pieza, grado, total) => `${pieza}, size ${grado} of ${total}`,
    cantidad: (pieza, cuantas) => `${pieza}, quantity ${cuantas}`,
    sitio: (sitio, total) => `Place ${sitio} of ${total}`,
  },

  pista: {
    destino: (nombre) => `${nombre}. This is where it goes`,
    pareja: (nombre) => `${nombre}. Here is the match`,
  },

  celebracion: {
    partida: 'Well done!',
    nivel: 'You did it!',
    seguir: 'Keep playing',
  },

  ajustes: {
    abrir: 'Settings. Press and hold to open',
    titulo: 'Settings',
    idioma: 'Language',
    volumen: 'Volume',
    silencio: 'Sound off',
    reiniciar: {
      titulo: "What's been played",
      boton: 'Start over',
      pregunta: 'Everything played is deleted and the game goes back to the beginning. This cannot be undone.',
      confirmar: 'Yes, delete it',
      cancelar: 'Cancel',
    },
  },
}
