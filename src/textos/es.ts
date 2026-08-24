import { type Textos } from './index'

/**
 * Castellano. Los nombres de pieza llevan tilde y mayúscula inicial: son
 * etiquetas para leer y para pronunciar, no identificadores. Los sin tilde de
 * `src/lib/piezas.ts` (`montana`, `platano`) viajan en la URL; estos no.
 */
export const es: Textos = {
  nombre: 'JuegaFormas',
  volver: 'Volver',

  mecanicas: {
    encajar: 'Encajar',
    emparejar: 'Emparejar',
    ordenar: 'Ordenar',
  },

  temas: {
    espacio: 'Espacio',
    animales: 'Animales',
    mar: 'Mar',
    naturaleza: 'Naturaleza',
    comida: 'Comida',
    deportes: 'Deportes',
    vehiculos: 'Vehículos',
  },

  piezas: {
    'espacio/cohete': 'Cohete',
    'espacio/planeta': 'Planeta',
    'espacio/estrella': 'Estrella',
    'espacio/luna': 'Luna',
    'espacio/satelite': 'Satélite',
    'espacio/astronauta': 'Astronauta',

    'animales/leon': 'León',
    'animales/elefante': 'Elefante',
    'animales/jirafa': 'Jirafa',
    'animales/oso': 'Oso',
    'animales/conejo': 'Conejo',
    'animales/zorro': 'Zorro',

    'mar/pez': 'Pez',
    'mar/pulpo': 'Pulpo',
    'mar/ballena': 'Ballena',
    'mar/cangrejo': 'Cangrejo',
    'mar/medusa': 'Medusa',
    'mar/caracola': 'Caracola',

    'naturaleza/arbol': 'Árbol',
    'naturaleza/flor': 'Flor',
    'naturaleza/nube': 'Nube',
    'naturaleza/hoja': 'Hoja',
    'naturaleza/montana': 'Montaña',
    'naturaleza/seta': 'Seta',

    'comida/manzana': 'Manzana',
    'comida/platano': 'Plátano',
    'comida/zanahoria': 'Zanahoria',
    'comida/pan': 'Pan',
    'comida/queso': 'Queso',
    'comida/helado': 'Helado',

    'deportes/balon': 'Balón',
    'deportes/canasta': 'Canasta',
    'deportes/raqueta': 'Raqueta',
    'deportes/medalla': 'Medalla',
    'deportes/pesa': 'Pesa',
    'deportes/porteria': 'Portería',

    'vehiculos/coche': 'Coche',
    'vehiculos/autobus': 'Autobús',
    'vehiculos/tren': 'Tren',
    'vehiculos/avion': 'Avión',
    'vehiculos/camion': 'Camión',
    'vehiculos/bicicleta': 'Bicicleta',
  },

  arrastre: {
    instrucciones:
      'Arrastra cada pieza hasta su hueco. Con teclado: espacio para cogerla, flechas para moverla y espacio otra vez para soltarla.',
    cogida: 'Pieza cogida.',
    sobreHueco: 'Sobre un hueco.',
    fueraDeHueco: 'Fuera de los huecos.',
    encajada: 'Pieza encajada.',
    devuelta: 'La pieza vuelve a su sitio.',
  },

  cartaTapada: 'Carta por descubrir',

  orden: {
    instrucciones: {
      tamano:
        'Coloca las piezas de la más pequeña a la más grande. Con teclado: espacio para cogerla, flechas para moverla y espacio otra vez para soltarla.',
      cantidad:
        'Coloca las piezas de la que tiene menos a la que tiene más. Con teclado: espacio para cogerla, flechas para moverla y espacio otra vez para soltarla.',
    },
    // Con número y no con «pequeña, mediana, grande»: los adjetivos solo llegan
    // a tres, y una secuencia de cinco los deja sin palabras. Además hay que
    // concordar con el género de la pieza, y aquí no se conoce: «Manzana,
    // tamaño 2» vale para las cuarenta y dos, «Manzana pequeño» no.
    tamano: (pieza, grado, total) => `${pieza}, tamaño ${grado} de ${total}`,
    cantidad: (pieza, cuantas) => `${pieza}, cantidad ${cuantas}`,
    sitio: (sitio, total) => `Sitio ${sitio} de ${total}`,
  },

  pista: {
    destino: (nombre) => `${nombre}. Aquí va`,
    pareja: (nombre) => `${nombre}. Aquí está la pareja`,
  },

  celebracion: {
    partida: '¡Muy bien!',
    nivel: '¡Lo has conseguido!',
    seguir: 'Seguir jugando',
  },

  ajustes: {
    abrir: 'Ajustes. Mantén pulsado para abrir',
    titulo: 'Ajustes',
    idioma: 'Idioma',
    volumen: 'Volumen',
    silencio: 'Sin sonido',
    reiniciar: {
      titulo: 'Lo jugado',
      boton: 'Empezar de cero',
      pregunta: 'Se borra todo lo jugado y el juego vuelve al principio. Esto no se puede deshacer.',
      confirmar: 'Sí, borrar',
      cancelar: 'Cancelar',
    },
  },
}
